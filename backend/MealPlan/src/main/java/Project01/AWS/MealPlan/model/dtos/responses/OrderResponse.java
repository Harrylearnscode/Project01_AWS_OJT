package Project01.AWS.MealPlan.model.dtos.responses;

import Project01.AWS.MealPlan.model.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private String address;
    private LocalDateTime orderTime;
    private LocalDateTime endTime;
    private Double deliveryPrice;
    private Double ingredientsPrice;
    private Double totalPrice;
    private OrderStatus status;
    private Long userId;
    private String userName;
}
