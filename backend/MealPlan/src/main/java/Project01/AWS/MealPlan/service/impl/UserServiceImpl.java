package Project01.AWS.MealPlan.service.impl;


import Project01.AWS.MealPlan.mapper.UserMapper;
import Project01.AWS.MealPlan.model.dtos.requests.AdminUserRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UserRequest;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedOrderResponse;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedUserResponse;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.enums.UserStatus;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.UserService;
import Project01.AWS.MealPlan.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    public static final String CUSTOMER_ROLE = "CUSTOMER";
    public static final String ADMIN_ROLE = "ADMIN";
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse createUser(UserRequest request) {
        try {
            User entity = User.builder()
                    .name(request.getName())
                    .phone(request.getPhone())
                    .address(request.getAddress())
                    .role(request.getRole())
                    .password(bCryptPasswordEncoder.encode(request.getPassword()))
                    .active(true)
                    .email(request.getEmail())
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
        existing.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        existing.setEmail(request.getEmail());
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
    public PaginatedUserResponse getAllUsers(String search, Pageable pageable) {
        Sort validatedSort = pageable.getSort().stream()
                .filter(user -> {
                    String p = user.getProperty();
                    return p.equals("userId") || p.equals("name")
                            || "phone".equals(p)
                            || "address".equals(p)
                            || "email".equals(p)
                            || "role".equals(p)
                            || "active".equals(p);
                })
                .collect(Collectors.collectingAndThen(Collectors.toList(), Sort::by));

        Pageable validatedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                validatedSort
        );

        Page<User> userPage = (search != null && !search.isBlank())
                ? userRepository.searchUsers(search, validatedPageable)
                : userRepository.findAll(validatedPageable);

        List<UserResponse> userDTOs = userPage.stream()
                .map(UserMapper::toResponse)
                .toList();

        return PaginatedUserResponse.builder()
                .users(userDTOs)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .currentPage(userPage.getNumber())
                .build();
    
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

    @Override
    public UserResponse createAdmin(AdminUserRequest request) {
        try {
            User existing = userRepository.findByEmail(request.getEmail()).orElse(null);
            if(existing != null) {
                throw new ActionFailedException("Email already in use");
            }
            User entity = User.builder()
                    .name(request.getName())
                    .phone(request.getPhone())
                    .address(request.getAddress())
                    .role(ADMIN_ROLE)
                    .password(bCryptPasswordEncoder.encode(request.getPassword()))
                    .active(true)
                    .email(request.getEmail())
                    .build();
            User saved = userRepository.save(entity);
            return UserMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create user");
        }
    }
}
