package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.CartDishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartDishResponse;

import java.util.List;

public interface CartDishService {
    /*CartDishResponse addDishToCart(CartDishRequest request);*/
    CartDishResponse updateQuantity(Long id, Integer quantity);
    void removeDishFromCart(Long id);
    List<CartDishResponse> getDishesByCart(Long cartId);
}
