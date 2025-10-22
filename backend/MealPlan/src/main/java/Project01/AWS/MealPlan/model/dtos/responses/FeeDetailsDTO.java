package Project01.AWS.MealPlan.model.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeeDetailsDTO {
    private String name;
    private int fee;

    @JsonProperty("insurance_fee")
    private int insuranceFee;

    @JsonProperty("delivery")
    private boolean delivery;
}
