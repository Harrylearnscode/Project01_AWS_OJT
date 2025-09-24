package Project01.AWS.MealPlan.model.dtos.requests;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequest {
    private String name;
    private String phone;
    private String address;
    private String role;
    private String password;
}
