package Project01.AWS.MealPlan.model.dtos.user;

import Project01.AWS.MealPlan.model.entities.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private long expiresIn;
    private UserDto user;
}
