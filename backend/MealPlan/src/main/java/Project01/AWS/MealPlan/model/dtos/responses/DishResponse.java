package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;
import Project01.AWS.MealPlan.model.enums.DishStatus;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishResponse {
    private Long id;
    private String name;
    private String description;
    private Integer prepareTime;
    private Integer cookingTime;
    private Integer totalTime;
    private String imgUrl;
    private Double price;
    private String country;
    private DishStatus status;
    private List<String> types;
    private List<DishIngredientSimpleResponse> dishIngredients;
    private Map<String, List<String>> recipes;
}
