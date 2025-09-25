package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DishIngredientResponse {
    private Long id;
    private Long dishId;
    private String dishName;
    private Long ingredientId;
    private String ingredientName;
    private Integer quantity;
    private String unit;
}
