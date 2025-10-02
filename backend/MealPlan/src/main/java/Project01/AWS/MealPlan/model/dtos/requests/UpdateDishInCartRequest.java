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
public class UpdateDishInCartRequest {
    private Long cartDishId; // ID của món cần chỉnh
    private Long dishId;
    private Integer quantity;
    private List<CartIngredientRequest> ingredients;
}
