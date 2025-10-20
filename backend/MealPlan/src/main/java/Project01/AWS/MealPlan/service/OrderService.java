package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse updateStatus(Long orderId, String status);
    List<OrderResponse> getOrdersByUser(Long userId);
    List<OrderResponse> getAllOrders();
    OrderResponse checkout(OrderRequest request);
    void cancelOrder(Long orderId, Long userId, String reason);
    OrderDetailResponse getOrderByOrderId(Long orderId);
    OrderStatusResponse getOrderStatusByOrderId(Long orderId);
}
