package Project01.AWS.MealPlan.model.dtos.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GHTKShippingFeeResponse {
    private boolean success;
    private String message;
    private FeeDetailsDTO fee;
}
