package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.RecipeResponse;
import Project01.AWS.MealPlan.model.entities.Recipe;

public class RecipeMapper {
    public static RecipeResponse toResponse(Recipe entity) {
        if (entity == null) return null;
        return RecipeResponse.builder()
                .recipeId(entity.getRecipeId())
                .type(entity.getType())
                .step(entity.getStep())
                .content(entity.getContent())
                .dishId(entity.getDish() != null ? entity.getDish().getDishId() : null)
                .dishName(entity.getDish() != null ? entity.getDish().getName() : null)
                .build();
    }
}
