package Project01.AWS.MealPlan.model.exception;

import org.springframework.http.HttpStatus;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;

public class NotFoundException extends MealPlanSystemException {
    public NotFoundException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("NOT_FOUND")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }
}

