package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.DishIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishIngredientResponse;
import Project01.AWS.MealPlan.mapper.DishIngredientMapper;
import Project01.AWS.MealPlan.model.entities.Dish;
import Project01.AWS.MealPlan.model.entities.DishIngredient;
import Project01.AWS.MealPlan.model.entities.Ingredient;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.DishIngredientRepository;
import Project01.AWS.MealPlan.repository.DishRepository;
import Project01.AWS.MealPlan.repository.IngredientRepository;
import Project01.AWS.MealPlan.service.DishIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DishIngredientServiceImpl implements DishIngredientService {

    private final DishIngredientRepository dishIngredientRepository;
    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    public DishIngredientResponse create(DishIngredientRequest request) {
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new NotFoundException("Dish not found"));
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new NotFoundException("Ingredient not found"));

        DishIngredient dishIngredient = DishIngredient.builder()
                .dish(dish)
                .ingredient(ingredient)
                .quantity(request.getQuantity())
                .build();

        double totalPrice = dish.getDishIngredients().stream()
                .mapToDouble(di -> di.getQuantity() * di.getIngredient().getPrice())
                .sum();

        dish.setPrice(totalPrice);
        dishRepository.save(dish);

        dishIngredientRepository.save(dishIngredient);
        return DishIngredientMapper.toResponse(dishIngredient);
    }

    @Override
    public DishIngredientResponse getById(Long id) {
        DishIngredient dishIngredient = dishIngredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("DishIngredient not found"));
        return DishIngredientMapper.toResponse(dishIngredient);
    }

    @Override
    public List<DishIngredientResponse> getAll() {
        return dishIngredientRepository.findAll()
                .stream()
                .map(DishIngredientMapper::toResponse)
                .toList();
    }

    @Override
    public DishIngredientResponse update(Long id, DishIngredientRequest request) {
        DishIngredient dishIngredient = dishIngredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("DishIngredient not found"));

        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new NotFoundException("Dish not found"));
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new NotFoundException("Ingredient not found"));

        dishIngredient.setDish(dish);
        dishIngredient.setIngredient(ingredient);
        dishIngredient.setQuantity(request.getQuantity());

        dishIngredientRepository.save(dishIngredient);

        double totalPrice = dish.getDishIngredients().stream()
                .mapToDouble(di -> di.getQuantity() * di.getIngredient().getPrice())
                .sum();

        dish.setPrice(totalPrice);
        return DishIngredientMapper.toResponse(dishIngredient);
    }

    @Override
    public void delete(Long id) {
        DishIngredient dishIngredient = dishIngredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("DishIngredient not found"));
        dishIngredientRepository.delete(dishIngredient);
    }
}
