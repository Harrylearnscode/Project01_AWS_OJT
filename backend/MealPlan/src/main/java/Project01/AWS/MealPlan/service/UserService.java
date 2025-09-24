package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.UserRequest;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id); // safe delete
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
}
