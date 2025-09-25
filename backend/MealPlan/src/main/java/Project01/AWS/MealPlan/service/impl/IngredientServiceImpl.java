package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.IngredientMapper;
import Project01.AWS.MealPlan.model.dtos.requests.IngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.IngredientResponse;
import Project01.AWS.MealPlan.model.entities.Ingredient;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.IngredientRepository;
import Project01.AWS.MealPlan.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;

    @Override
    public IngredientResponse createIngredient(IngredientRequest request) {
        try {
            Ingredient ingredient = Ingredient.builder()
                    .name(request.getName())
                    .price(request.getPrice())
                    .unit(request.getUnit())
                    .stock(request.getStock())
                    .build();

            Ingredient saved = ingredientRepository.save(ingredient);
            return IngredientMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create ingredient");
        }
    }

    @Override
    public IngredientResponse updateIngredient(Long id, IngredientRequest request) {
        Ingredient existing = ingredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ingredient not found"));

        existing.setName(request.getName());
        existing.setPrice(request.getPrice());
        existing.setUnit(request.getUnit());
        existing.setStock(request.getStock());

        try {
            Ingredient updated = ingredientRepository.save(existing);
            return IngredientMapper.toResponse(updated);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to update ingredient");
        }
    }

    @Override
    public void deleteIngredient(Long id) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ingredient not found"));
        try {
            ingredientRepository.delete(ingredient);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to delete ingredient");
        }
    }

    @Override
    public List<IngredientResponse> getAllIngredients() {
        try {
            return ingredientRepository.findAll()
                    .stream()
                    .map(IngredientMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get ingredients");
        }
    }

    @Override
    public IngredientResponse getIngredientById(Long id) {
        try {
            Ingredient ingredient = ingredientRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Ingredient not found"));
            return IngredientMapper.toResponse(ingredient);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get ingredient");
        }
    }
}
