package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.UserService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
