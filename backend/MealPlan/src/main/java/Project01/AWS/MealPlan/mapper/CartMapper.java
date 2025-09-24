package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;

import java.util.stream.Collectors;

public class CartMapper {
    public static CartResponse toResponse(Cart entity) {
        if (entity == null) return null;
        return CartResponse.builder()
                .cartId(entity.getCartId())
                .userId(entity.getUser().getUserId())
                .dishIds(entity.getDishes().stream()
                        .map(d -> d.getDish().getDishId())
                        .collect(Collectors.toSet()))
                .ingredientIds(entity.getIngredients().stream()
                        .map(i -> i.getIngredient().getIngredientId())
                        .collect(Collectors.toSet()))
                .build();
    }
}
