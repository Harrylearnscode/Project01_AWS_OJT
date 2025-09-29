package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.CartIngredientResponse;
import Project01.AWS.MealPlan.model.entities.CartIngredient;

public class CartIngredientMapper {
    public static CartIngredientResponse toDTO(CartIngredient entity) {
        if (entity == null) return null;
        return CartIngredientResponse.builder()
                .id(entity.getId())
                .cartDishId(entity.getCartDish().getId())
                .ingredientId(entity.getIngredient().getIngredientId())
                .ingredientName(entity.getIngredient().getName())
                .quantity(entity.getQuantity())
                .build();
    }
}
