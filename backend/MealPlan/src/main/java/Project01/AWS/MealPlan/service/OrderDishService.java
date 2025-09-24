package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.OrderDishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderDishResponse;

import java.util.List;

public interface OrderDishService {
    OrderDishResponse addDishToOrder(OrderDishRequest request);
    OrderDishResponse updateQuantity(Long id, Integer quantity);
    void removeDishFromOrder(Long id);
    List<OrderDishResponse> getDishesByOrder(Long orderId);
}
