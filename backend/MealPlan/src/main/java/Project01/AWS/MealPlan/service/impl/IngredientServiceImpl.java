package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.IngredientMapper;
import Project01.AWS.MealPlan.model.dtos.requests.IngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.IngredientResponse;
import Project01.AWS.MealPlan.model.entities.*;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.IngredientRepository;
import Project01.AWS.MealPlan.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
                    .calories(request.getCalories())
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
        existing.setCalories(request.getCalories());

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

    @Transactional
    @Override
    public void checkAndDeductStock(Set<CartDish> cartDishes) {
        for (CartDish cd : cartDishes) {
            for (CartIngredient ci : cd.getIngredients()) {

                Ingredient ingredient = ingredientRepository.findById(ci.getIngredient().getIngredientId())
                        .orElseThrow(() -> new RuntimeException(
                                "Ingredient not found: " + ci.getIngredient().getName()));

                int totalRequired = ci.getQuantity() * cd.getQuantity();

                if (ingredient.getStock() < totalRequired) {
                    throw new RuntimeException("Out of stock: " + ingredient.getName());
                }

                ingredient.setStock(ingredient.getStock() - totalRequired);
                ingredientRepository.save(ingredient);
            }
        }
    }

    @Transactional(propagation = Propagation.MANDATORY)
    @Override
    public void restoreStockFromOrder(Order order) {
        // Tính tổng số lượng cần trả về cho mỗi ingredient id
        Map<Long, Integer> restoreMap = new HashMap<>();
        for (OrderDish od : order.getOrderDishes()) {
            for (OrderIngredient oi : od.getIngredients()) {
                Long ingId = oi.getIngredient().getIngredientId();
                restoreMap.merge(ingId, oi.getQuantity(), Integer::sum);
            }
        }

        if (restoreMap.isEmpty()) return;

        // Lấy tất cả ingredients 1 lần
        List<Ingredient> ingredients = ingredientRepository.findAllById(restoreMap.keySet());

        for (Ingredient ing : ingredients) {
            Integer add = restoreMap.get(ing.getIngredientId());
            if (add != null && add > 0) {
                // Cẩn thận: kiểu stock có thể là int/long/BigDecimal tuỳ model
                ing.setStock(ing.getStock() + add);
            }
        }

        ingredientRepository.saveAll(ingredients);
    }
}
