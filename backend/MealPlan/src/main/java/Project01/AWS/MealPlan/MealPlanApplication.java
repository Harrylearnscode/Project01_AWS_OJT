package Project01.AWS.MealPlan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EntityScan(basePackages = "Project01.AWS.MealPlan.model.entities")
@EnableWebSecurity
public class MealPlanApplication {

	public static void main(String[] args) {
		SpringApplication.run(MealPlanApplication.class, args);
	}

}
