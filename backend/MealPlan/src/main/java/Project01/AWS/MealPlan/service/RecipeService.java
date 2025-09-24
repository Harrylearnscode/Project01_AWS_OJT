package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.RecipeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.RecipeResponse;
import java.util.List;

public interface RecipeService {
    RecipeResponse createRecipe(RecipeRequest request);
    RecipeResponse updateRecipe(Long id, RecipeRequest request);
    void deleteRecipe(Long id);
    List<RecipeResponse> getAllRecipes();
    RecipeResponse getRecipeById(Long id);
}
