package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.user.*;
import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.CartRepository;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final CartRepository cartRepository;

    @Override
    public User register(RegisterUserDto registerRequest) {
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new RuntimeException("Email already in use");
        }
        try {
            User user = new User(
                    registerRequest.getUsername(),
                    registerRequest.getEmail(),
                    bCryptPasswordEncoder.encode(registerRequest.getPassword()),
                    registerRequest.getAddress(),
                    registerRequest.getPhone(),
                    "CUSTOMER",
                    false
            );
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpiry(LocalDateTime.now().plusMinutes(15));
            sendverificationEmail(user);
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Email already exists!", ex);
        }
    }

    public User authenticate(LoginUserDto loginUserDto) {
        User user = userRepository.findByEmail(loginUserDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(!user.isActive()){
            throw new RuntimeException("Account not activated");
        }
        Cart cart = cartRepository.findByUser_Email(loginUserDto.getEmail())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(userRepository.findByEmail(loginUserDto.getEmail())
                                        .orElseThrow(() -> new NotFoundException("User not found")))
                                .build()
                ));
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUserDto.getEmail(),
                        loginUserDto.getPassword()
                )
        );
        return user;
    }

    public void verifyUser(VerifyUserDto verifyUserDto) {
        Optional<User> optionalUser = userRepository.findByEmail(verifyUserDto.getEmail());
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            if(user.getVerificationExpiry().isBefore(LocalDateTime.now())){
                throw new RuntimeException("Verification code expired");
            }
            if(user.getVerificationCode().equals(verifyUserDto.getVerificationCode())){
                user.setActive(true);
                user.setVerificationCode(null);
                user.setVerificationExpiry(null);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            User user = optionalUser.get();
            if(user.isActive()){
                throw new RuntimeException("Account already activated");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpiry(LocalDateTime.now().plusMinutes(15));
            sendverificationEmail(user);
            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void sendverificationEmail(User user) {
        String subject = "Your Verification Code";
        String verificationCode = user.getVerificationCode();
        String userName = user.getName() != null ? user.getName() : "Friend";

        // HTML email (Java text block)
        String html = String.format("""
        <html>
          <body style="font-family: Arial, sans-serif; line-height:1.4; color:#333;">
            <div style="max-width:600px; margin:0 auto; padding:20px; border:1px solid #eaeaea; border-radius:8px;">
              <h2 style="margin-top:0;">Hello %s,</h2>
              <p>Use the verification code below to complete your action. This code will expire in <strong>15 minutes</strong>.</p>
              <p style="font-size:24px; letter-spacing:2px; text-align:center; margin:20px 0; padding:12px; background:#f7f7f7; border-radius:6px;">
                <strong>%s</strong>
              </p>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <hr style="border:none; border-top:1px solid #eee; margin:18px 0;" />
              <p style="font-size:12px; color:#777;">Need help? Reply to this email or visit our <a href=\"#\">support page</a>.</p>
            </div>
          </body>
        </html>
        """, userName, verificationCode);
        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, html);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        int code = (int)(Math.random() * 900000) + 100000; // tạo mã 6 chữ số
        return String.valueOf(code);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByName(String name) {
        return userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void sendPasswordResetEmail(User user) {
        String subject = "Password Reset Code";
        String resetCode = user.getVerificationCode();
        String userName = user.getName() != null ? user.getName() : "Friend";

        String html = String.format("""
    <html>
      <body style="font-family: Arial, sans-serif; line-height:1.4; color:#333;">
        <div style="max-width:600px; margin:0 auto; padding:20px; border:1px solid #eaeaea; border-radius:8px;">
          <h2 style="margin-top:0;">Password Reset Request</h2>
          <p>Hello %s,</p>
          <p>Use the code below to reset your password. This code will expire in <strong>15 minutes</strong>.</p>
          <p style="font-size:24px; letter-spacing:2px; text-align:center; margin:20px 0; padding:12px; background:#f7f7f7; border-radius:6px;">
            <strong>%s</strong>
          </p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        </div>
      </body>
    </html>
    """, userName, resetCode);

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, html);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void requestPasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            sendPasswordResetEmail(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resetPassword(ResetPasswordUserDto resetPasswordDto) {
        // Validate password confirmation
        if (!resetPasswordDto.getNewPassword().equals(resetPasswordDto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        Optional<User> optionalUser = userRepository.findByEmail(resetPasswordDto.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Check if verification code matches
            if (!resetPasswordDto.getVerificationCode().equals(user.getVerificationCode())) {
                throw new RuntimeException("Invalid verification code");
            }

            // Check if code has expired
            if (user.getVerificationExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code expired");
            }

            // Update password and clear verification code
            user.setPassword(bCryptPasswordEncoder.encode(resetPasswordDto.getNewPassword()));
            user.setVerificationCode(null);
            user.setVerificationExpiry(null);

            userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }


//    public User findOrCreateOAuth2User(String email, String name) {
//        Optional<User> existingUser = userRepository.findByEmail(email);
//
//        if (existingUser.isPresent()) {
//            User user = existingUser.get();
//            // Activate the user if they login via OAuth2
//            if (!user.isActive()) {
//                user.setActive(true);
//                user.setVerificationCode(null);
//                user.setVerificationExpiry(null);
//                return userRepository.save(user);
//            }
//            return user;
//        } else {
//            // Create new user for OAuth2 login
//            User newUser = User.builder()
//                    .name(name)
//                    .email(email)
//                    .password(bCryptPasswordEncoder.encode("OAUTH2_USER")) // Placeholder password
//                    .role("CUSTOMER")
//                    .active(true) // OAuth2 users are automatically activated
//                    .build();
//
//            return userRepository.save(newUser);
//        }
//    }

}
