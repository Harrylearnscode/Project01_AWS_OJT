package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.RecipeMapper;
import Project01.AWS.MealPlan.model.dtos.requests.RecipeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.RecipeResponse;
import Project01.AWS.MealPlan.model.entities.Dish;
import Project01.AWS.MealPlan.model.entities.Recipe;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.DishRepository;
import Project01.AWS.MealPlan.repository.RecipeRepository;
import Project01.AWS.MealPlan.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final DishRepository dishRepository;

    @Override
    public RecipeResponse createRecipe(RecipeRequest request) {
        try {
            Dish dish = dishRepository.findById(request.getDishId())
                    .orElseThrow(() -> new NotFoundException("Dish not found"));

            Recipe recipe = Recipe.builder()
                    .type(request.getType())
                    .step(request.getStep())
                    .content(request.getContent())
                    .dish(dish)
                    .build();

            Recipe saved = recipeRepository.save(recipe);
            return RecipeMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create recipe");
        }
    }

    @Override
    public RecipeResponse updateRecipe(Long id, RecipeRequest request) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Recipe not found"));

        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new NotFoundException("Dish not found"));

        existing.setType(request.getType());
        existing.setStep(request.getStep());
        existing.setContent(request.getContent());
        existing.setDish(dish);

        try {
            Recipe updated = recipeRepository.save(existing);
            return RecipeMapper.toResponse(updated);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to update recipe");
        }
    }

    @Override
    public void deleteRecipe(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Recipe not found"));
        try {
            recipeRepository.delete(recipe);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to delete recipe");
        }
    }

    @Override
    public List<RecipeResponse> getAllRecipes() {
        try {
            return recipeRepository.findAll()
                    .stream()
                    .map(RecipeMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get recipes");
        }
    }

    @Override
    public RecipeResponse getRecipeById(Long id) {
        try {
            Recipe recipe = recipeRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Recipe not found"));
            return RecipeMapper.toResponse(recipe);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get recipe");
        }
    }
}
