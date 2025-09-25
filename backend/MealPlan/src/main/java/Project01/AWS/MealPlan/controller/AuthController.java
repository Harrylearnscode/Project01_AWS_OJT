package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.user.*;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.service.AuthService;
import Project01.AWS.MealPlan.service.impl.AuthServiceImpl;
import Project01.AWS.MealPlan.service.impl.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthServiceImpl authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authService.register(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("User verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code resent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }







//    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterUserDto registerRequest){
//        RegisterResponse registerResponse = authService.register(registerRequest);
//        return ResponseEntity.ok().body(
//            RegisterResponse.builder()
//                .id(registerResponse.getId())
//                .username(registerResponse.getUsername())
//                .email(registerResponse.getEmail())
//                    .role(registerResponse.getRole())
//                .phone(registerResponse.getPhone())
//                .address(registerResponse.getAddress())
//                .active(registerResponse.isActive())
//                .build()
//        );
//    }
}
