package Project01.AWS.MealPlan.model.dtos.responses;

import Project01.AWS.MealPlan.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderStatusResponse {
    private Long orderId;
    private OrderStatus status;
}
