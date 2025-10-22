package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.GHTKShippingFeeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.GHTKShippingFeeResponse;

public interface GHTKService {
    GHTKShippingFeeResponse calculateFee(GHTKShippingFeeRequest request) throws Exception;
}
