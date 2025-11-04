package Project01.AWS.MealPlan.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/home")
    public String homePage() {
        return "home"; // loads templates/home.html
    }
}
