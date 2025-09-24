package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;
    private String address;
    private Double deliveryPrice;
}
