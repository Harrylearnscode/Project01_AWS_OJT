package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserRequest {
    private String name;
    private String phone;
    private String address;
    private String email;
    private String password;
}
