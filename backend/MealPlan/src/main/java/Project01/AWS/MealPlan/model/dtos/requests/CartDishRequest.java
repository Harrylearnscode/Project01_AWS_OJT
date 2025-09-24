package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.Data;

@Data
public class CartDishRequest {
    private Long cartId;
    private Long dishId;
    private Integer quantity;
}
