package Project01.AWS.MealPlan.security;

import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.service.impl.AuthServiceImpl;
import Project01.AWS.MealPlan.service.impl.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CognitoAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthServiceImpl authService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // Extract user info from Cognito
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Find or create user in local database
        User user = authService.findOrCreateOAuth2User(email, name);

        // Generate JWT token
        String jwtToken = jwtService.generateToken(user);

        // Redirect to frontend with token
        response.sendRedirect("http://localhost:8080/?token=" + jwtToken);
    }
}
