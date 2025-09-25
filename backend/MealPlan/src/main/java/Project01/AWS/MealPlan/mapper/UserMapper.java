package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;

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
                .build();
    }
}
