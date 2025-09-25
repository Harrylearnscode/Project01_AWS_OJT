package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.OrderMapper;
import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderResponse;
import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

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
                .ingredientsPrice(0.0) // sẽ tính sau
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
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUser_UserId(userId).stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }
}
