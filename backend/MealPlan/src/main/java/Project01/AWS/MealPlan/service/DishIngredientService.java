package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.DishIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishIngredientResponse;

import java.util.List;

public interface DishIngredientService {
    DishIngredientResponse create(DishIngredientRequest request);
    DishIngredientResponse getById(Long id);
    List<DishIngredientResponse> getAll();
    DishIngredientResponse update(Long id, DishIngredientRequest request);
    void delete(Long id);
}
