package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.OrderIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderIngredientResponse;

import java.util.List;

public interface OrderIngredientService {
    OrderIngredientResponse addIngredientToOrder(OrderIngredientRequest request);
    OrderIngredientResponse updateQuantity(Long id, Integer quantity);
    void removeIngredientFromOrder(Long id);
    List<OrderIngredientResponse> getIngredientsByOrderDish(Long orderDishId);
}
