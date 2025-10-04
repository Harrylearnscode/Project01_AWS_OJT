package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeRequest {
    private String type;
    private Integer step;
    private String content;
    private Long dishId;
}
