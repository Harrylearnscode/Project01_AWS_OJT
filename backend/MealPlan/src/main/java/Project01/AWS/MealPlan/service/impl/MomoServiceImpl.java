package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.Configs.MomoConfig;
import Project01.AWS.MealPlan.client.MomoAPI;
import Project01.AWS.MealPlan.controller.MomoController;
import Project01.AWS.MealPlan.model.dtos.requests.CreateMomoRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CreateMomoResponse;
import Project01.AWS.MealPlan.model.dtos.responses.MomoIpnResponse;
import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.repository.CartRepository;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.service.MomoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoServiceImpl implements MomoService {
    @Value("${momo.partner-code}")
    private String PARTNER_CODE;

    @Value("${momo.access-key}")
    private String ACCESS_KEY;

    @Value("${momo.secret-key}")
    private String SECRET_KEY;

    @Value("http.localhost:3000/")
    private String REDIRECT_URL;

    @Value("${momo.ipn-url}")
    private String IPN_URL;

    @Value("${momo.request-type}")
    private String REQUEST_TYPE;

    @Value("${momo.endpoint}")
    private String ENDPOINT;

    private final MomoAPI momoAPI;
    private final OrderRepository orderRepository;
    private final MomoConfig momoConfig;
    private final CartRepository cartRepository;

    private String signHmacSHA256(String data, String key) throws Exception {
        Mac hmacSHA256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        hmacSHA256.init(secretKey);

        byte[] hash = hmacSHA256.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();

        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }

        return hexString.toString();
    }

    @Override
    public CreateMomoResponse createQR(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        String momoOrderid = UUID.randomUUID().toString();

        String orderInfo = "Pay money for your order";

        String requestId = UUID.randomUUID().toString();

        String extraData = Base64.getEncoder()
                .encodeToString(("orderId=" + order.getOrderId()).getBytes(StandardCharsets.UTF_8));

        long amount = Math.max(0, Math.round(order.getTotalPrice() == null ? 0.0 : order.getTotalPrice()));

//        order.setStatus(OrderStatus.PAID);
//
//        order.setPaidTime(LocalDateTime.now());

        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%s&requestType=%s",
                ACCESS_KEY,
                amount,
                extraData,
                IPN_URL,
                momoOrderid,
                orderInfo,
                PARTNER_CODE,
                REDIRECT_URL,
                requestId,
                REQUEST_TYPE
        );
        String prettySignature = "";
        try {
            prettySignature = signHmacSHA256(rawSignature, SECRET_KEY);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        if(prettySignature.isEmpty()){
            throw new RuntimeException("Failed to generate signature");
        }

        CreateMomoRequest request = CreateMomoRequest.builder()
                .partnerCode(PARTNER_CODE)
                .requestType(REQUEST_TYPE)
                .ipnUrl(IPN_URL)
                .redirectUrl(REDIRECT_URL)
                .orderId(momoOrderid)
                .orderInfo(orderInfo)
                .requestId(requestId)
                .extraData(extraData)
                .amount(amount)
                .signature(prettySignature)
                .lang("vi")
                .build();
        return momoAPI.createMomoQr(request);
    }

    @Override
    public void processIpn(MomoIpnResponse ipnResponse) {
        // 1. Validate Signature
        String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&message=%s&orderId=%s&orderInfo=%s&orderType=%s&partnerCode=%s&payType=%s&requestId=%s&responseTime=%s&resultCode=%s&transId=%s",
                momoConfig.getAccessKey(), ipnResponse.getAmount(), ipnResponse.getExtraData(), ipnResponse.getMessage(),
                ipnResponse.getOrderId(), ipnResponse.getOrderInfo(), ipnResponse.getOrderType(), ipnResponse.getPartnerCode(),
                ipnResponse.getPayType(), ipnResponse.getRequestId(), ipnResponse.getResponseTime(), ipnResponse.getResultCode(),
                ipnResponse.getTransId()
        );

        String signature;
        try {
            signature = signHmacSHA256(rawSignature, momoConfig.getSecretKey());
        } catch (Exception e) {
            log.error("Failed to generate signature for IPN validation", e);
            return;
        }

        if (!signature.equals(ipnResponse.getSignature())) {
            log.warn("IPN signature validation failed for orderId: {}", ipnResponse.getOrderId());
            return;
        }

        // 2. Check Result Code
        if (ipnResponse.getResultCode() == 0) {
            // 3. Update Order Status
            try {
                String decodedExtraData = new String(Base64.getDecoder().decode(ipnResponse.getExtraData()), StandardCharsets.UTF_8);
                String[] parts = decodedExtraData.split("=");
                if (parts.length == 2 && "orderId".equals(parts[0])) {
                    Long orderId = Long.parseLong(parts[1]);
                    Order order = orderRepository.findById(orderId)
                            .orElseThrow(() -> new IllegalArgumentException("Order not found from IPN: " + orderId));

                    if (order.getStatus() != OrderStatus.PAID) {
                        order.setStatus(OrderStatus.PAID);
                        order.setPaidTime(LocalDateTime.now());
                        orderRepository.save(order);
                        log.info("Order {} has been paid successfully.", orderId);
                    }
                    // Clear the user's cart
                    Cart cart = cartRepository.findByUser_UserId(order.getUser().getUserId())
                            .orElse(null);
                    if (cart != null) {
                        cart.getCartDishes().clear();
                        cartRepository.save(cart);
                        log.info("Cart cleared for user {}", order.getUser().getUserId());
                    }
                }
            } catch (Exception e) {
                log.error("Error processing successful IPN for Momo orderId: {}", ipnResponse.getOrderId(), e);
            }
        } else {
            log.warn("Received failed IPN for Momo orderId: {}. ResultCode: {}", ipnResponse.getOrderId(), ipnResponse.getResultCode());
            // Optionally, handle failed payments (e.g., set order status to FAILED)
        }
    }
}
