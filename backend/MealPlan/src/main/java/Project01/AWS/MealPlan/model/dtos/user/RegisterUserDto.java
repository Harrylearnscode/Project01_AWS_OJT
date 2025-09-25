package Project01.AWS.MealPlan.model.dtos.user;

import lombok.Data;

@Data

public class RegisterUserDto {
    private String username;
    private String email;
    private String phone;
    private String address;
    private String password;
}
