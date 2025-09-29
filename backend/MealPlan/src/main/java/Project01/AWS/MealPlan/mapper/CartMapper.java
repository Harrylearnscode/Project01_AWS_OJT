package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;

import java.util.Set;
import java.util.stream.Collectors;

public class CartMapper {
    public static CartResponse toResponse(Cart entity) {
        if (entity == null) return null;

        return CartResponse.builder()
                .cartId(entity.getCartId())
                .userId(entity.getUser().getUserId())
                .dishes(entity.getDishes().stream()
                        .map(CartDishMapper::toDTO)
                        .collect(Collectors.toSet()))
                .build();
    }
}

