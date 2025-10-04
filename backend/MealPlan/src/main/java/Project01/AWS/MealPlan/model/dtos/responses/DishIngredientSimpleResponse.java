package Project01.AWS.MealPlan.model.dtos.responses;

import Project01.AWS.MealPlan.model.entities.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishIngredientSimpleResponse {
    private String ingredient;
    private Integer quantity;
    private String unit;
    private Double price;
    private Double calories;
}
