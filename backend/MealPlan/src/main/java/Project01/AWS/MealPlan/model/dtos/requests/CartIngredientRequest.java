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
    private Integer quantity; //Bình thường sẽ là delta, nhưng lúc add to cart thì sẽ là số lượng cụ thể
}
