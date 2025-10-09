package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.IngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.IngredientResponse;
import Project01.AWS.MealPlan.model.entities.CartDish;
import Project01.AWS.MealPlan.model.entities.Order;

import java.util.List;
import java.util.Set;

public interface IngredientService {
    IngredientResponse createIngredient(IngredientRequest request);
    IngredientResponse updateIngredient(Long id, IngredientRequest request);
    void deleteIngredient(Long id);
    List<IngredientResponse> getAllIngredients();
    IngredientResponse getIngredientById(Long id);
    void checkAndDeductStock(Set<CartDish> cartDishes);
    void restoreStockFromOrder(Order order);
}
