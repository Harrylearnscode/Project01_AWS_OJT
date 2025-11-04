package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

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
    private Set<Long> typeIds;
    private List<DishIngredientRequest> dishIngredients;
    private List<RecipeRequest> recipes;
}
