package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddDishToCartRequest {
    private Long dishId;
    private Integer quantity;
    private List<CartIngredientRequest> ingredients;
}
