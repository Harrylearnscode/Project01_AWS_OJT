package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.Data;

@Data
public class DishIngredientRequest {
    private Long dishId;
    private Long ingredientId;
    private Integer quantity;
    private String unit;
}
