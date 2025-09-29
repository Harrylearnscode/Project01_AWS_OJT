package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartIngredientRequest {
    private Long ingredientId;
    private Integer quantity;
}
