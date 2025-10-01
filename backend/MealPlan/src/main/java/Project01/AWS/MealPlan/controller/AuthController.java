package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.mapper.UserMapper;
import Project01.AWS.MealPlan.model.dtos.user.*;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.service.AuthService;
import Project01.AWS.MealPlan.service.impl.AuthServiceImpl;
import Project01.AWS.MealPlan.service.impl.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthServiceImpl authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterUserDto registerUserDto) {
        try {
            User registeredUser = authService.register(registerUserDto);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        User userInfo = authService.getUserByEmail(loginUserDto.getEmail());
        UserDto userDto = UserMapper.toUserDto(userInfo);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), userDto);
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

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordUserDto resetPasswordDto) {
        try {
            authService.resetPassword(resetPasswordDto);
            return ResponseEntity.ok("Password reset successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/request-code-reset-password")
    public ResponseEntity<?> requestPasswordReset(@RequestParam String email) {
        try {
            authService.requestPasswordReset(email);
            return ResponseEntity.ok("Password reset code sent successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication != null && authentication.isAuthenticated()) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User user = authService.getUserByEmail(userDetails.getUsername());
                UserDto userDto = UserMapper.toUserDto(user);
                return ResponseEntity.ok(userDto);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }
    
//    @GetMapping("/oauth2/success")
//    public ResponseEntity<?> oauth2LoginSuccess(Authentication authentication) {
//        try {
//            OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
//            Map<String, Object> attributes = oauth2Token.getPrincipal().getAttributes();
//
//            String email = (String) attributes.get("email");
//            String name = (String) attributes.get("name");
//
//            // Check if user exists, if not create new user
//            User user = authService.findOrCreateOAuth2User(email, name);
//
//            // Generate JWT token
//            String jwtToken = jwtService.generateToken(user);
//
//            LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), user);
//            return ResponseEntity.ok(loginResponse);
//
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(Map.of("error", "OAuth2 login failed: " + e.getMessage()));
//        }
//    }
//
//    @GetMapping("/oauth2/failure")
//    public ResponseEntity<?> oauth2LoginFailure() {
//        return ResponseEntity.badRequest().body(Map.of("error", "OAuth2 login failed"));
//    }








}
