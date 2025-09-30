package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.constants.MomoParameter;
import Project01.AWS.MealPlan.model.dtos.requests.CreateMomoRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CreateMomoResponse;
import Project01.AWS.MealPlan.service.MomoService;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.openfeign.FeignClient;
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
/*
    @GetMapping("ipn-handler")
    public String ipnHandler(@RequestParam Map<String, String> request) {
        Integer resultCode = Integer.valueOf(request.get(MomoParameter.RESULT_CODE));
        return resultCode == 0 ? "Success" : "Failed" ;
    }*/
}
