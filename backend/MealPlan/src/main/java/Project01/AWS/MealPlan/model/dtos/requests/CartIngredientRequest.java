package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.Data;

@Data
public class CartIngredientRequest {
    private Long cartId;
    private Long ingredientId;
    private Integer quantity;
}
