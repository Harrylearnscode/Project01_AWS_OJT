package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    OrderResponse updateStatus(Long orderId, String status);
    void cancelOrder(Long orderId); // soft delete
    List<OrderResponse> getOrdersByUser(Long userId);
    List<OrderResponse> getAllOrders();
}
