package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishRequest {
    private String name;
    private String description;
    private Integer prepareTime;
    private Integer cookingTime;
    private Integer totalTime;
    private Long countryId;
    private Double price;
    private Set<Long> typeIds;
    private List<DishIngredientCRUDDishRequest> dishIngredients;
    private List<RecipeCRUDDishRequest> recipes;
}
