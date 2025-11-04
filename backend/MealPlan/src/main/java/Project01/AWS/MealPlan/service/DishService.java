package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.dtos.requests.DishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.dtos.responses.DishSummaryResponse;
import Project01.AWS.MealPlan.model.entities.Dish;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DishService {
    DishResponse createDish(DishRequest request);
    DishResponse updateDish(Long id, DishRequest request);
    void deleteDish(Long id);
    List<DishSummaryResponse> getAllDishes();
    DishResponse getDishById(Long id);
    List<DishSummaryResponse> getDishByCountryId(Long countryId);
    List<DishSummaryResponse> getDishByTypeId(Long typeId);
    List<DishSummaryResponse> getRelatedDishes(Long currentDishId, int limit);
    String uploadDishImage(Long dishId, MultipartFile file) throws IOException;
}
