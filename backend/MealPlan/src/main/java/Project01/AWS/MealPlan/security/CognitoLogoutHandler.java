package Project01.AWS.MealPlan.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;

/**
 * Cognito has a custom logout url.
 * See more information <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/logout-endpoint.html">here</a>.
 */

@Component
public class CognitoLogoutHandler implements LogoutSuccessHandler {

    @Value("${aws.cognito.domain}")
    private String cognitoDomain;

    @Value("${spring.security.oauth2.client.registration.cognito.client-id}")
    private String clientId;

    @Value("${aws.cognito.logout-url}")
    private String logoutUrl;


    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String targetUrl = UriComponentsBuilder
                .fromHttpUrl(cognitoDomain + "/logout")
                .queryParam("client_id", clientId)
                .queryParam("logout_uri", logoutUrl)
                .encode() // Ensure special characters are encoded
                .build()
                .toUriString();

        // Redirect the user to AWS Cognito
        response.sendRedirect(targetUrl);
    }
}
