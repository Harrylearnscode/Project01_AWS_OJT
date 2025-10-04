package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientRequest {
    private String name;
    private Double price;
    private String unit;
    private Integer stock;
    private Double calories;
}
