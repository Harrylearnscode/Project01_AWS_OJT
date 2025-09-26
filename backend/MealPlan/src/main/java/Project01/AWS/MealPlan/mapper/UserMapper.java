package Project01.AWS.MealPlan.mapper;


import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;
import Project01.AWS.MealPlan.model.dtos.user.RegisterResponse;

public class UserMapper {
    public static UserResponse toResponse(User entity) {
        if (entity == null) return null;
        return UserResponse.builder()
                .userId(entity.getUserId())
                .name(entity.getName())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .role(entity.getRole())
                .active(entity.isActive())
                .email(entity.getEmail())
                .build();
    }
      public RegisterResponse userToRegisterResponse(User user) {
        if(user == null) {
            return null;
        }
    return RegisterResponse.builder()
            .id(user.getUserId())
            .username(user.getName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .address(user.getAddress())
            .active(user.isActive())
            .build();
    }
//    public static User toEntity(RegisterResponse dto) {
//        if (dto == null) return null;
//        return User.builder()
//                .userId(dto.getId())
//                .name(dto.getUsername())
//                .email(dto.getEmail())
//                .phone(dto.getPhone())
//                .address(dto.getAddress())
//                .active(dto.isActive());
//      }
}
