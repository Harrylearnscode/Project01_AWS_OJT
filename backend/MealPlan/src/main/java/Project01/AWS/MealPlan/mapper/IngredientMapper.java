package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.IngredientResponse;
import Project01.AWS.MealPlan.model.entities.Ingredient;

public class IngredientMapper {
    public static IngredientResponse toResponse(Ingredient entity) {
        if (entity == null) return null;
        return IngredientResponse.builder()
                .ingredientId(entity.getIngredientId())
                .name(entity.getName())
                .price(entity.getPrice())
                .unit(entity.getUnit())
                .stock(entity.getStock())
                .build();
    }
}
