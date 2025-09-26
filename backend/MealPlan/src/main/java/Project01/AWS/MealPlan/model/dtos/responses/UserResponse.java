package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;
import Project01.AWS.MealPlan.model.enums.UserStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long userId;
    private String name;
    private String phone;
    private String address;
    private String email;
    private String role;
    private boolean active;
}
