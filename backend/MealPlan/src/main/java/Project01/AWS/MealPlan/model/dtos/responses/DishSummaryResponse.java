package Project01.AWS.MealPlan.model.dtos.responses;

import Project01.AWS.MealPlan.model.enums.DishStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishSummaryResponse {
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
}
