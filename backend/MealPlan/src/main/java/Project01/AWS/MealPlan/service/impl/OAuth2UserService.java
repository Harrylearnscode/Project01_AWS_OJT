package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        processOAuth2User(email, name);

        return oauth2User;
    }

    private void processOAuth2User(String email, String name) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            User newUser = User.builder()
                    .name(name)
                    .email(email)
                    .password("")
                    .role("CUSTOMER")
                    .active(true)
                    .build();
            userRepository.save(newUser);
        } else {
            User user = existingUser.get();
            if (!user.isActive()) {
                user.setActive(true);
                user.setVerificationCode(null);
                user.setVerificationExpiry(null);
                userRepository.save(user);
            }
        }
    }

}
