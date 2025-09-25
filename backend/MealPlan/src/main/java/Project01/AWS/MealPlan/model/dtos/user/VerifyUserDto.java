package Project01.AWS.MealPlan.model.dtos.user;

import lombok.Data;

@Data
public class VerifyUserDto {
    private String email;
    private String verificationCode;
}
