package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResponseObject {
    private String code;
    private String message;
    private Object data;
    private boolean isSuccess;
    private HttpStatus status;
}
