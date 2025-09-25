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
    private Set<Long> dishIds;       // danh sách id món trong giỏ
    private Set<Long> ingredientIds; // danh sách id nguyên liệu trong giỏ
}
