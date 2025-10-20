package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.CartMapper;
import Project01.AWS.MealPlan.mapper.OrderMapper;
import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.*;
import Project01.AWS.MealPlan.model.entities.*;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.*;
import Project01.AWS.MealPlan.service.IngredientService;
import Project01.AWS.MealPlan.service.MomoService;
import Project01.AWS.MealPlan.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final IngredientRepository ingredientRepository;
    private final OrderDishRepository orderDishRepository;
    private final OrderIngredientRepository orderIngredientRepository;
    private final IngredientService ingredientService;
    private final MomoService momoService;

    @Override
    public OrderResponse createOrder(OrderRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .address(request.getAddress())
                .orderTime(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .deliveryPrice(request.getDeliveryPrice())
                .phoneNumber(request.getPhoneNumber())
                .totalPrice(request.getDeliveryPrice()) // = ingredientPrice + deliveryPrice
                .build();

        return OrderMapper.toDTO(orderRepository.save(order));
    }

    @Override
    public OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setEndTime(LocalDateTime.now());
        }

        return OrderMapper.toDTO(orderRepository.save(order));
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUser_UserId(userId).stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PaginatedOrderResponse getAllOrders(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(order -> {
                    String p = order.getProperty();
                    return p.equals("orderId") || p.equals("address")
                            || "orderTime".equals(p)
                            || "endTime".equals(p)
                            || "status".equals(p)
                            || "deliveryPrice".equals(p)
                            || "ingredientsPrice".equals(p)
                            || "totalPrice".equals(p)
                            || "user.userId".equals(p);
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<Order> orderPage;

        if (search != null && !search.isBlank()) {
            orderPage = orderRepository.searchOrdersByStatus(search, OrderStatus.PAID, validatedPageable);
        } else {
            orderPage = orderRepository.findByStatus(OrderStatus.PAID, validatedPageable);
        }

        List<OrderResponse> orderDTOs = orderPage.stream()
                .map(OrderMapper::toDTO)
                .toList();

        return PaginatedOrderResponse.builder()
                .orders(orderDTOs)
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .currentPage(orderPage.getNumber())
                .build();
    }

    @Transactional
    @Override
    public OrderResponse checkout(OrderRequest request) {
        Cart cart = cartRepository.findByUser_UserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        Set<CartDish> cartDishes = cart.getCartDishes();

        ingredientService.checkAndDeductStock(cartDishes);

        User user = cart.getUser();
        String address = request.getAddress();
        double deliveryPrice = request.getDeliveryPrice();

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .orderTime(LocalDateTime.now())
                .address(address)
                .deliveryPrice(deliveryPrice)
                .totalPrice(0.0)
                .totalCalories(0.0)
                .phoneNumber(request.getPhoneNumber())
                .build();
        orderRepository.save(order);

        for (CartDish cd : cartDishes) {
            OrderDish od = OrderDish.builder()
                    .order(order)
                    .dish(cd.getDish())
                    .quantity(cd.getQuantity())
                    .build();
            orderDishRepository.save(od);

            for (CartIngredient ci : cd.getIngredients()) {
                OrderIngredient oi = OrderIngredient.builder()
                        .orderDish(od)
                        .ingredient(ci.getIngredient())
                        .quantity(ci.getQuantity() * cd.getQuantity())
                        .build();
                orderIngredientRepository.save(oi);
            }
        }

        double subtotal = cartDishes.stream()
                .mapToDouble(cd -> cd.getIngredients().stream()
                        .mapToDouble(ci -> ci.getQuantity() * ci.getIngredient().getPrice())
                        .sum() * cd.getQuantity())
                .sum();

        double totalCalories = cartDishes.stream()
                .mapToDouble(cd -> cd.getIngredients().stream()
                        .mapToDouble(ci -> ci.getQuantity() * ci.getIngredient().getCalories())
                        .sum() * cd.getQuantity())
                .sum();

        double finalTotal = subtotal + deliveryPrice;

        order.setTotalPrice(finalTotal);
        order.setTotalCalories(totalCalories);
        orderRepository.save(order);

        CreateMomoResponse momoResponse = momoService.createQR(order.getOrderId());
        String payUrl = momoResponse.getPayUrl();

        OrderResponse orderResponse = OrderMapper.toDTO(order);
        orderResponse.setPayUrl(payUrl);

//        return OrderMapper.toDTO(orderRepository.save(order));
        return orderResponse;
    }

    @Transactional
    @Override
    public void cancelOrder(Long orderId, Long userId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"You are not allowed to cancel this order.");
        }

        // tránh cancel lại nhiều lần
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order already cancelled.");
        }

        validateOrderCancelable(order);
        validateUserCancelLimit(userId);

        // 1) phục hồi stock cho các ingredient liên quan
        ingredientService.restoreStockFromOrder(order);

        // 2) cập nhật trạng thái order
        order.setCanceledReason(reason);
        order.setStatus(OrderStatus.CANCELLED);
        order.setCanceledAt(LocalDateTime.now());
        orderRepository.save(order);
    }


    private void validateUserCancelLimit(Long userId) {
        long cancelCount = orderRepository.countByUser_UserIdAndStatusAndCanceledAtAfter(
                userId, OrderStatus.CANCELLED, LocalDateTime.now().minusDays(1)
        );
        if (cancelCount >= 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can only cancel up to 3 orders per day.");
        }
    }

    @Scheduled(fixedRate = 60000) // 1 phút kiểm tra 1 lần
    @Transactional
    public void autoCancelUnpaidOrders() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(15);
        List<Order> unpaidOrders = orderRepository.findAllByStatusAndOrderTimeBefore(
                OrderStatus.PENDING, threshold
        );
        for (Order order : unpaidOrders) {
            ingredientService.restoreStockFromOrder(order);

            order.setStatus(OrderStatus.CANCELLED);
            order.setCanceledReason("Payment timeout");
            order.setCanceledAt(LocalDateTime.now());

            orderRepository.save(order);
        }
    }

    private void validateOrderCancelable(Order order) {
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Order cannot be canceled at this stage.");
        }
    }

    @Override
    public OrderDetailResponse getOrderByOrderId(Long orderId) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new NotFoundException("Order not found"));
            return OrderMapper.toResponse(order);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get order with ID: %s", orderId));
        }
    }

    @Override
    public OrderStatusResponse getOrderStatusByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        return OrderMapper.toStatusResponse(order);
    }
}
