package Project01.AWS.MealPlan.client;

import Project01.AWS.MealPlan.model.dtos.requests.CreateMomoRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CreateMomoResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "momo", url = "${momo.endpoint}")
public interface MomoAPI {
    @PostMapping("/create")
    CreateMomoResponse createMomoQr(@RequestBody CreateMomoRequest request);
}
