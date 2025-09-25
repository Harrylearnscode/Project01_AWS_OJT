package Project01.AWS.MealPlan.model.dtos.user;

import lombok.Data;

@Data
public class LoginUserDto {
    private String email;
    private String password;
}
