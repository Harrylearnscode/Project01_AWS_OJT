package Project01.AWS.MealPlan.model.dtos.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GHTKShippingFeeRequest {

    @JsonProperty("pick_province")
    private String pickProvince;

    @JsonProperty("pick_district")
    private String pickDistrict;

    private String province;
    private String district;
    private String address;
    private int weight; // gram
    private int value; // giá trị đơn hàng (VND)
}
