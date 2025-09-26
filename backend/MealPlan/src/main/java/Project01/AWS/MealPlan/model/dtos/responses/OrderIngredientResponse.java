package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderIngredientResponse {
    private Long id;
    private Long orderId;
    private Long ingredientId;
    private String ingredientName;
    private Integer quantity;
}
