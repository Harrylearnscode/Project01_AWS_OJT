package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;

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
    private String imgUrl;
    private Double price;
    private Long countryId;
    private Set<Long> typeIds; // liên kết với Type
}
