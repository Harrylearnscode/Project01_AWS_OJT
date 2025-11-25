package Project01.AWS.MealPlan.service;


import Project01.AWS.MealPlan.model.dtos.requests.AdminUserRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CognitoUserRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UserPhoneAndAddressRequest;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedOrderResponse;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedUserResponse;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.dtos.requests.UserRequest;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;
import org.springframework.data.domain.Pageable;


import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id); // safe delete
    PaginatedUserResponse getAllUsers(String search, Pageable pageable);
    UserResponse getUserById(Long id);
    UserResponse createAdmin(AdminUserRequest request);
    UserResponse updatePhoneAndAddress(Long id, UserPhoneAndAddressRequest request);
    UserResponse updateCognitoUser(String sub, CognitoUserRequest request);
    void enableUser(Long id);
}
