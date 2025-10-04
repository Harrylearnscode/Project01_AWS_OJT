package Project01.AWS.MealPlan.model.dtos.responses;

import Project01.AWS.MealPlan.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long orderId;
    private String address;
    private LocalDateTime orderTime;
    private LocalDateTime endTime;
    private Double deliveryPrice;
    private Double ingredientsPrice;
    private Double totalPrice;
    private Double totalCalories;
    private OrderStatus status;
    private Long userId;
    private String userName;
}
