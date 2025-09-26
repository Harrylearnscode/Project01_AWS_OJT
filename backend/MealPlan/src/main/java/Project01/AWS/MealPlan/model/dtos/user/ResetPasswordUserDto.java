package Project01.AWS.MealPlan.model.dtos.user;

import lombok.Data;

@Data
public class ResetPasswordUserDto {
    private String email;
    private String verificationCode;
    private String newPassword;
    private String confirmPassword;
}
