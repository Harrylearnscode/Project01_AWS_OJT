package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartDishResponse {
    private Long id;
    private Long cartId;
    private Long dishId;
    private String dishName;
    private Integer quantity;
}
