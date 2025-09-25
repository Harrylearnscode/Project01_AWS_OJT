package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeResponse {
    private Long recipeId;
    private String type;
    private Integer step;
    private String content;
    private Long dishId;
    private String dishName;
}
