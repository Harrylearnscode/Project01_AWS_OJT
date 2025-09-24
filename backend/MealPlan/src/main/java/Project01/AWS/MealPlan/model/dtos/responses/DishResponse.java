package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;
import Project01.AWS.MealPlan.model.enums.DishStatus;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishResponse {
    private Long dishId;
    private String name;
    private String description;
    private Integer prepareTime;
    private Integer cookingTime;
    private Integer totalTime;
    private String imgUrl;
    private Double price;
    private DishStatus status;
    private Long countryId;
    private String countryName;
    private Set<String> typeNames; // danh sách tên type
}
