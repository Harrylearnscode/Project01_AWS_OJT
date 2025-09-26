package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.DishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.entities.Dish;

import java.util.List;

public interface DishService {
    DishResponse createDish(DishRequest request);
    DishResponse updateDish(Long id, DishRequest request);
    void deleteDish(Long id);
    List<DishResponse> getAllDishes();
    DishResponse getDishById(Long id);
    List<DishResponse> getDishByCountryId(Long countryId);
    List<DishResponse> getDishByTypeId(Long typeId);
}
