package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.client.MomoAPI;
import Project01.AWS.MealPlan.controller.MomoController;
import Project01.AWS.MealPlan.model.dtos.requests.CreateMomoRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CreateMomoResponse;
import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.service.MomoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
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
}
