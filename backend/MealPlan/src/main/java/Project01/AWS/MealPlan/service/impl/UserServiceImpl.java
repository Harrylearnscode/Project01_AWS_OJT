package Project01.AWS.MealPlan.service.impl;


import Project01.AWS.MealPlan.model.dtos.requests.UserRequest;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.enums.UserStatus;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.UserService;
import Project01.AWS.MealPlan.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserResponse createUser(UserRequest request) {
        try {
            User entity = User.builder()
                    .name(request.getName())
                    .phone(request.getPhone())
                    .address(request.getAddress())
                    .role(request.getRole())
                    .password(request.getPassword())
                    .active(true)
                    .build();
            User saved = userRepository.save(entity);
            return UserMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create user");
        }
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find user with ID: %s", id)
                ));
        existing.setName(request.getName());
        existing.setPhone(request.getPhone());
        existing.setAddress(request.getAddress());
        existing.setRole(request.getRole());
        existing.setPassword(request.getPassword());
        try {
            User updated = userRepository.save(existing);
            return UserMapper.toResponse(updated);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to update user with ID: %s", id));
        }
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find user with ID: %s", id)
                ));
        if (user.isActive() == false) {
            throw new ActionFailedException("User already deleted");
        }
        try {
            user.setActive(false);
            userRepository.save(user);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to delete user with ID: %s", id));
        }
    }

    @Override
    public List<UserResponse> getAllUsers() {
        try {
            return userRepository.findAllByActive(true).stream()
                    .map(UserMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get users");
        }
    }

    @Override
    public UserResponse getUserById(Long id) {
        try {
            User user = userRepository.findByUserIdAndActive(id, true)
                    .orElseThrow(() -> new NotFoundException("User not found or deleted"));
            return UserMapper.toResponse(user);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get user with ID: %s", id));
        }

    }
}
