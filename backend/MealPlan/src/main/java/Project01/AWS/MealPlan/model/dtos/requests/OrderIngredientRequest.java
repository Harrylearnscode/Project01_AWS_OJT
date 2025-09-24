package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.Data;

@Data
public class OrderIngredientRequest {
    private Long orderId;
    private Long ingredientId;
    private Integer quantity;
}
