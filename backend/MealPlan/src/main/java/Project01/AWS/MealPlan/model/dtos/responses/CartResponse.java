package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private Long cartId;
    private Long userId;
    private Set<CartDishResponse> dishes;
}
