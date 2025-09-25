package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.CartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartIngredientResponse;

import java.util.List;

public interface CartIngredientService {
    CartIngredientResponse addIngredientToCart(CartIngredientRequest request);
    CartIngredientResponse updateQuantity(Long id, Integer quantity);
    void removeIngredientFromCart(Long id);
    List<CartIngredientResponse> getIngredientsByCart(Long cartId);
}
