package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.OrderMapper;
import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderResponse;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedOrderResponse;
import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

        Page<Order> orderPage = (search != null && !search.isBlank())
                ? orderRepository.searchOrders(search, validatedPageable)
                : orderRepository.findAll(validatedPageable);

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
}
