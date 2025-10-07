package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.mapper.UserMapper;
import Project01.AWS.MealPlan.model.dtos.requests.Oauth2TokenRequest;
import Project01.AWS.MealPlan.model.dtos.user.*;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.service.AuthService;
import Project01.AWS.MealPlan.service.impl.AuthServiceImpl;
import Project01.AWS.MealPlan.service.impl.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

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

    @PutMapping("/me/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String email,
            @RequestBody UpdateProfileDto updateProfileDto
    ) {
        try {
            User updatedUser = authService.updateUserProfile(email, updateProfileDto);
            UserDto userDto = UserMapper.toUserDto(updatedUser);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/oauth2/success")
    public ResponseEntity<?> oauth2LoginSuccess(Authentication authentication) {
        try {
            OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
            Map<String, Object> attributes = oauth2Token.getPrincipal().getAttributes();

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            // Check if user exists, if not create new user
            User user = authService.findOrCreateOAuth2User(email, name);

            UserDto userDto = UserMapper.toUserDto(user);

            // Generate JWT token
            String jwtToken = jwtService.generateToken(user);

            LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), userDto);
            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "OAuth2 login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/oauth2/failure")
    public ResponseEntity<?> oauth2LoginFailure() {
        return ResponseEntity.badRequest().body(Map.of("error", "OAuth2 login failed"));
    }

 //   https://accounts.google.com/o/oauth2/v2/auth?client_id=872552687649-vvqck5l0g4v92n6pr4hrq1sie0lqov3e.apps.googleusercontent.com&redirect_uri=http://localhost:8080/login/oauth2/code/google&response_type=code&scope=email%20profile
 // decode %2F to  /
    @PostMapping("/oauth2/token")
    public ResponseEntity<?> exchangeOAuth2Token(@RequestBody Oauth2TokenRequest request) {
        String code = request.getCode();

        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authorization code is required"));
        }

        // Log the received code for debugging
        System.out.println("Received authorization code: " + code);
        System.out.println("Code length: " + code.length());

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            // Use the code as-is without additional encoding
            params.add("code", code.trim());
            params.add("client_id", "872552687649-vvqck5l0g4v92n6pr4hrq1sie0lqov3e.apps.googleusercontent.com");
            params.add("client_secret", "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");
            params.add("redirect_uri", "http://localhost:8080/login/oauth2/code/google");
            params.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://oauth2.googleapis.com/token",
                    tokenRequest,
                    Map.class
            );

            String accessToken = (String) response.getBody().get("access_token");

            HttpHeaders userHeaders = new HttpHeaders();
            userHeaders.setBearerAuth(accessToken);
            HttpEntity<String> userInfoRequest = new HttpEntity<>(userHeaders);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    userInfoRequest,
                    Map.class
            );

            String email = (String) userInfoResponse.getBody().get("email");
            String name = (String) userInfoResponse.getBody().get("name");

            User user = authService.findOrCreateOAuth2User(email, name);
            UserDto userDto = UserMapper.toUserDto(user);

            String jwtToken = jwtService.generateToken(user);
            LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), userDto);

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            // Log the full error for debugging
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
