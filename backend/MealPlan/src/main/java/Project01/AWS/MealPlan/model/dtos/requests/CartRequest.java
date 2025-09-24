package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartRequest {
    private Long userId; // chỉ cần userId để tạo cart
}
