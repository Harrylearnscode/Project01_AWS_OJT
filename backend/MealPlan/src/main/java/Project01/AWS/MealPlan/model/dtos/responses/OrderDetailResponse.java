package Project01.AWS.MealPlan.model.dtos.responses;

import Project01.AWS.MealPlan.model.enums.OrderStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailResponse {
    private Long orderId;
    private String address;
    private String phoneNumber;
    private String canceledReason;
    private LocalDateTime orderTime;
    private LocalDateTime canceledAt;
    private LocalDateTime endTime;
    private Double deliveryPrice;
    private Double totalPrice;
    private Double totalCalories;
    private LocalDateTime paidTime;
    private OrderStatus status;
    private String userName;
    private Set<OrderDishResponse> dishes;
}
