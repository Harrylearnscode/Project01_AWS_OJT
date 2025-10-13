package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.CartDishResponse;
import Project01.AWS.MealPlan.model.entities.CartDish;

public class CartDishMapper {
    public static CartDishResponse toDTO(CartDish entity) {
        if (entity == null) return null;
        return CartDishResponse.builder()
                .id(entity.getId())
                .cartId(entity.getCart().getCartId())
                .dishId(entity.getDish().getDishId())
                .dishName(entity.getDish().getName())
                .quantity(entity.getQuantity())
                .imgUrl(entity.getDish().getImgUrl())
                .build();
    }
}