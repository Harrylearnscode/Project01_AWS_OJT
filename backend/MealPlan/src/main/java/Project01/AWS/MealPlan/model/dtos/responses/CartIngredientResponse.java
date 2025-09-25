package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartIngredientResponse {
    private Long id;
    private Long cartId;
    private Long ingredientId;
    private String ingredientName;
    private Integer quantity;
}
