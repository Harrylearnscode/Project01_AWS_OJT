package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.OrderIngredientResponse;
import Project01.AWS.MealPlan.model.entities.OrderIngredient;

public class OrderIngredientMapper {
    public static OrderIngredientResponse toDTO(OrderIngredient entity) {
        if (entity == null) return null;
        return OrderIngredientResponse.builder()
                .id(entity.getId())
                .orderDishId(entity.getOrderDish().getId())
                .ingredientId(entity.getIngredient().getIngredientId())
                .ingredientName(entity.getIngredient().getName())
                .quantity(entity.getQuantity())
                .build();
    }
}
