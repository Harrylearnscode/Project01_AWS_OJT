package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.IngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.IngredientResponse;
import java.util.List;

public interface IngredientService {
    IngredientResponse createIngredient(IngredientRequest request);
    IngredientResponse updateIngredient(Long id, IngredientRequest request);
    void deleteIngredient(Long id);
    List<IngredientResponse> getAllIngredients();
    IngredientResponse getIngredientById(Long id);
}
