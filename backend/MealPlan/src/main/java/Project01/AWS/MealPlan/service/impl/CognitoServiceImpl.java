package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.service.CognitoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminDisableUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminEnableUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UserNotFoundException;

@Service
@RequiredArgsConstructor
public class CognitoServiceImpl implements CognitoService {

    private final CognitoIdentityProviderClient cognitoClient;
    @Value("${spring.security.oauth2.client.provider.cognito.issuer-uri}")
    private String issuerUri;

    @Override
    public void disableUser(String sub) {
        try {
            String userPoolId = extractUserPoolId(issuerUri);

            AdminDisableUserRequest disableRequest = AdminDisableUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(sub)
                    .build();

            cognitoClient.adminDisableUser(disableRequest);

        } catch (UserNotFoundException e) {
            throw new RuntimeException("User not found in Cognito: " + sub);
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Failed to disable user in Cognito", e);
        }
    }

    @Override
    public void enableUser(String sub) {
        try {
            String userPoolId = extractUserPoolId(issuerUri);

            AdminEnableUserRequest enableRequest = AdminEnableUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(sub)
                    .build();

            cognitoClient.adminEnableUser(enableRequest);

        } catch (UserNotFoundException e) {
            throw new RuntimeException("User not found in Cognito: " + sub);
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Failed to enable user in Cognito", e);
        }
    }

    private String extractUserPoolId(String issuerUri) {
        // issuerUri format: https://cognito-idp.{region}.amazonaws.com/{userPoolId}
        String[] parts = issuerUri.split("/");
        return parts[parts.length - 1];
    }
}
