package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.GHTKShippingFeeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.GHTKShippingFeeResponse;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import Project01.AWS.MealPlan.service.GHTKService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ghtk-shipping")
@RequiredArgsConstructor
public class GHTKShippingController {
    private final GHTKService ghtkService;

    @GetMapping("/calculate-fee")
    @Operation(summary = "Calculate GHTK Shipping Fee",
    description = "Calculate shipping fee using GHTK API based on the provided request details.",
            parameters = {
                    @Parameter(
                            name = "Token",
                            description = "GHTK API Token",
                            required = true,
                            in = ParameterIn.HEADER
                    )
            }
    )
    public ResponseEntity<?> calculateShippingFee(@Valid @ParameterObject GHTKShippingFeeRequest request){
        try {
            GHTKShippingFeeResponse feeResponse = ghtkService.calculateFee(request);
            return ResponseEntity.ok(feeResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error calculating shipping fee: " + e.getMessage());
        }
    }
}
