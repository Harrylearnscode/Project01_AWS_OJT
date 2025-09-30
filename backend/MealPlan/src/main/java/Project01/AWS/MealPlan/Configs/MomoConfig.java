package Project01.AWS.MealPlan.Configs;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "momo")
@Data
public class MomoConfig {
    private String partnerCode;
    private String returnUrl;
    private String endpoint;
    private String ipnUrl;
    private String accessKey;
    private String secretKey;
    private String requestType;
}