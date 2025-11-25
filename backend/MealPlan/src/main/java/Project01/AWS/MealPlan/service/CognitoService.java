package Project01.AWS.MealPlan.service;

public interface CognitoService {
    public void disableUser(String sub);
    public void enableUser(String sub);
}
