package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.CreateMomoRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CreateMomoResponse;
import Project01.AWS.MealPlan.model.dtos.responses.MomoIpnResponse;

public interface MomoService {
    public CreateMomoResponse createQR(Long orderId);
    public void processIpn(MomoIpnResponse ipnResponse);
}
