package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.AddDishToCartRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CartRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UpdateDishInCartRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;

import java.util.List;

public interface CartService {
    CartResponse createCart(CartRequest request);
    CartResponse updateCart(Long id, CartRequest request); // đổi user
    void deleteCart(Long id);
    List<CartResponse> getAllCarts();
    CartResponse getCartById(Long id);
    CartResponse getCartByUserId(Long userId);
    void addDishToCart(Long userId, AddDishToCartRequest request);
    void removeDishFromCart(Long cartDishId);
    void updateDishInCart(UpdateDishInCartRequest request);
    Double getCartTotalPrice(Long userId);
    Double getCartTotalCalories(Long userId);
}
