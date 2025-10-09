package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.constants.MomoParameter;
import Project01.AWS.MealPlan.model.dtos.requests.CreateMomoRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CreateMomoResponse;
import Project01.AWS.MealPlan.model.dtos.responses.MomoIpnResponse;
import Project01.AWS.MealPlan.service.MomoService;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/momo")
@RequiredArgsConstructor
public class MomoController {

    private final MomoService momoService;

/*
@PostMapping("/create")
public CreateMomoResponse createQR(@RequestBody CreateMomoRequest createMomoRequest) {
    return momoService.createQR();
}
*/

    @PostMapping("/orders/{orderId}/create")
    public CreateMomoResponse createForOrder(@PathVariable Long orderId) {
        return momoService.createQR(orderId);
    }
    @PostMapping("/ipn-handler")
    public ResponseEntity<Void> ipnHandler(@RequestBody MomoIpnResponse ipnResponse) {
        momoService.processIpn(ipnResponse);
        // Acknowledge receipt to Momo. Do not include a body.
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
