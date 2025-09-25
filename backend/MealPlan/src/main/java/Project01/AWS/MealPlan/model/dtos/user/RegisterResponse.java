package Project01.AWS.MealPlan.model.dtos.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String phone;
    private String address;
    private boolean active;
}
