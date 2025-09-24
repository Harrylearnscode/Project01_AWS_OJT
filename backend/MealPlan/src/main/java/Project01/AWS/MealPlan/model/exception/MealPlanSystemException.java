package Project01.AWS.MealPlan.model.exception;

import lombok.Getter;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
@Getter
public class MealPlanSystemException extends RuntimeException {
    protected ResponseObject errorResponse;

    protected MealPlanSystemException(String message) {
        super(message);
    }
}
