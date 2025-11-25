package Project01.AWS.MealPlan.security;

import Project01.AWS.MealPlan.mapper.UserMapper;
import Project01.AWS.MealPlan.model.dtos.user.LoginResponse;
import Project01.AWS.MealPlan.model.dtos.user.UserDto;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.service.impl.AuthServiceImpl;
import Project01.AWS.MealPlan.service.impl.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CognitoAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(CognitoAuthenticationSuccessHandler.class);

    private final AuthServiceImpl authService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final OAuth2AuthorizedClientService authorizedClientService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        logger.info("Cognito OAuth2 attributes received: {}", attributes);

        //Extract claims
        String sub = claimToString(attributes.get("sub"));
        String email = claimToString(attributes.get("email"));

        // Name logic: try 'name', fallback to email parts
        String name = "placeholder-name";

        User user = authService.syncCognitoUserToLocal(sub, email, name);

        String jwtToken = "";
        long backendExpiresInMs = jwtService.getExpirationTime(); // Default fallback

        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            // Load the client that holds the tokens (Access & Refresh)
            OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(),
                    oauthToken.getName());

            if (client != null && client.getAccessToken() != null) {
                //Get the Real AWS Access Token
                jwtToken = client.getAccessToken().getTokenValue();

                //Get the Real Expiration Time from AWS
                Instant expiresAt = client.getAccessToken().getExpiresAt();
                if (expiresAt != null) {
                    backendExpiresInMs = expiresAt.toEpochMilli() - System.currentTimeMillis();
                }

                logger.info("Successfully retrieved AWS Access Token. Expires in {} ms", backendExpiresInMs);
            }
        }

        // Fallback
        if (jwtToken.isEmpty()) {
            logger.error("Could not retrieve AWS Token from AuthorizedClient");
            jwtToken = jwtService.generateTokenWithCustomExpiration(user, backendExpiresInMs);
        }

        UserDto userDto = UserMapper.toUserDto(user);
        LoginResponse loginResponse = new LoginResponse(jwtToken, backendExpiresInMs, userDto);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
    }

    private String claimToString(Object claim) {
        if (claim == null) return null;
        if (claim instanceof String) return (String) claim;
        try {
            return objectMapper.writeValueAsString(claim);
        } catch (Exception e) {
            return claim.toString();
        }
    }
}
