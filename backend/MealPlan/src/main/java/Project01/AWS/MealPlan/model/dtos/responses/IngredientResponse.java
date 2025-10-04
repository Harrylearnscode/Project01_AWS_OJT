package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientResponse {
    private Long ingredientId;
    private String name;
    private Double price;
    private String unit;
    private Integer stock;
    private Double calories;
}
