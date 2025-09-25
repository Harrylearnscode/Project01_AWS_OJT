package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.user.RegisterUserDto;
import Project01.AWS.MealPlan.model.dtos.user.RegisterResponse;
import Project01.AWS.MealPlan.model.entities.User;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    User register(RegisterUserDto registerRequest);
}
