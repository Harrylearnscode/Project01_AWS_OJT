package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.Data;

@Data
public class OrderDishRequest {
    private Long orderId;
    private Long dishId;
    private Integer quantity;
}
