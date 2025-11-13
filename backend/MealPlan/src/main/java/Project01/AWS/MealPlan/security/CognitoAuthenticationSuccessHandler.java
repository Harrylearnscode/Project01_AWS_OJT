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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CognitoAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(CognitoAuthenticationSuccessHandler.class);

    private final AuthServiceImpl authService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 🔍 Log all attributes from Cognito
        logger.info("Cognito OAuth2 attributes received: {}", attributes);

        String email = claimToString(attributes.get("email"));
        String preferred = claimToString(attributes.get("preferred_username"));
        String name = preferred;
        if (name == null || name.isBlank()) {
            name = claimToString(attributes.get("name"));
        }
        if (name == null || name.isBlank()) {
            // final fallback to local part of email or literal email
            name = (email != null && email.contains("@")) ? email.split("@")[0] : email;
        }
        String phone = claimToString(attributes.get("phone_number"));

        Object rawAddress = attributes.get("address");

        String address = extractAddress(attributes.get("address"));

        logger.info("Extracted -> email: {}, name: {}, phone: {}, address: {}", email, name, phone, address);

        // Find or create user in local database
        User user = authService.syncCognitoUserToLocal(email, name, phone, address);

        // Generate JWT token
        String jwtToken = jwtService.generateToken(user);

        UserDto userDto = UserMapper.toUserDto(user);

        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), userDto);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
    }

    private String claimToString(Object claim) {
        if (claim == null) return null;
        if (claim instanceof String) return (String) claim;
        try {
            // objectMapper is your existing Jackson ObjectMapper
            return objectMapper.writeValueAsString(claim);
        } catch (Exception e) {
            return claim.toString();
        }
    }

    private String extractAddress(Object rawAddress) {
        if (rawAddress == null) return null;

        if (rawAddress instanceof String) {
            return (String) rawAddress;
        }

        if (rawAddress instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> addrMap = (Map<String, Object>) rawAddress;

            // Pick a meaningful field if available
            Object formatted = addrMap.getOrDefault("formatted",
                    addrMap.getOrDefault("street_address",
                            addrMap.getOrDefault("postal_code",
                                    addrMap.getOrDefault("locality", null))));

            if (formatted != null) {
                return formatted.toString();
            }

            // Fallback: serialize the entire object
            try {
                return objectMapper.writeValueAsString(addrMap);
            } catch (Exception e) {
                return addrMap.toString();
            }
        }

        // If it's neither a Map nor a String, just toString it
        return rawAddress.toString();
    }

}
