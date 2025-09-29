package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.UpdateCartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartIngredientResponse;

import java.util.List;

public interface CartIngredientService {
    CartIngredientResponse addIngredientToCart(UpdateCartIngredientRequest request);
    CartIngredientResponse updateQuantity(Long id, Integer quantity);
    void removeIngredientFromCart(Long id);
    List<CartIngredientResponse> getIngredientsByCartDish(Long cartDishId);
}
