package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.requests.DishIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishIngredientResponse;
import Project01.AWS.MealPlan.model.entities.DishIngredient;

public class DishIngredientMapper {

    public static DishIngredientResponse toResponse(DishIngredient entity) {
        if (entity == null) return null;
        return DishIngredientResponse.builder()
                .id(entity.getId())
                .dishId(entity.getDish().getDishId())
                .dishName(entity.getDish().getName())
                .ingredientId(entity.getIngredient().getIngredientId())
                .ingredientName(entity.getIngredient().getName())
                .quantity(entity.getQuantity())
                .build();
    }
}
