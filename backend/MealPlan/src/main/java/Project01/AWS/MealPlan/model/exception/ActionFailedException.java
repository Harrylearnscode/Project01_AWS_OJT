package Project01.AWS.MealPlan.model.exception;

import org.springframework.http.HttpStatus;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;

public class ActionFailedException extends MealPlanSystemException {
    public ActionFailedException(String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code("ACTION_FAILED")
                .message(message)
                .data(null)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }

    public ActionFailedException(String code,String message) {
        super(message);
        this.errorResponse = ResponseObject.builder()
                .code(code)
                .data(null)
                .message(message)
                .isSuccess(false)
                .status(HttpStatus.OK)
                .build();
    }
}
