package Project01.AWS.MealPlan.model.dtos.user;

import lombok.Data;

@Data
public class UserDto {
    private long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
}
