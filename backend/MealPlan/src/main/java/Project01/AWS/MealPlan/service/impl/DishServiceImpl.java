package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.DishMapper;
import Project01.AWS.MealPlan.model.dtos.requests.*;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.dtos.responses.DishSummaryResponse;
import Project01.AWS.MealPlan.model.entities.*;
import Project01.AWS.MealPlan.model.enums.DishStatus;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.*;
import Project01.AWS.MealPlan.service.DishService;
import Project01.AWS.MealPlan.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DishServiceImpl implements DishService {

    private final DishRepository dishRepository;
    private final CountryRepository countryRepository;
    private final TypeRepository typeRepository;
    private final IngredientRepository ingredientRepository;
    private final S3Service s3Service;

    @Transactional
    @Override
    public DishResponse createDish(DishRequest request) {
        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new NotFoundException("Country not found"));

        Dish dish = Dish.builder()
                .name(request.getName())
                .description(request.getDescription())
                .prepareTime(request.getPrepareTime())
                .cookingTime(request.getCookingTime())
                .price(request.getPrice())
                .totalTime(request.getTotalTime())
                .status(DishStatus.ACTIVE)
                .country(country)
                .build();

        if (request.getTypeIds() != null && !request.getTypeIds().isEmpty()) {
            dish.setDishTypes(new HashSet<>(typeRepository.findAllById(request.getTypeIds())));
        }

        if (request.getDishIngredients() != null) {
            for (DishIngredientCRUDDishRequest diReq : request.getDishIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(diReq.getIngredientId())
                        .orElseThrow(() -> new NotFoundException("Ingredient not found"));

                dish.getDishIngredients().add(
                        DishIngredient.builder()
                                .dish(dish)
                                .ingredient(ingredient)
                                .quantity(diReq.getQuantity())
                                .build()
                );
            }
        }

        if (request.getRecipes() != null) {
            for (RecipeCRUDDishRequest rReq : request.getRecipes()) {
                dish.getRecipes().add(
                        Recipe.builder()
                                .dish(dish)
                                .type(rReq.getType())
                                .step(rReq.getStep())
                                .content(rReq.getContent())
                                .build()
                );
            }
        }

        Dish savedDish = dishRepository.save(dish);

        return DishMapper.toResponse(savedDish);
    }

    @Transactional
    @Override
    public DishResponse updateDish(Long id, DishRequest request) {
        // ===== 1. Lấy dish hiện có =====
        Dish existing = dishRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dish not found"));

        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new NotFoundException("Country not found"));

        // ===== 2. Cập nhật thông tin cơ bản =====
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrepareTime(request.getPrepareTime());
        existing.setCookingTime(request.getCookingTime());
        existing.setTotalTime(request.getTotalTime());
        existing.setCountry(country);

        // ===== 3. Cập nhật type =====
        if (request.getTypeIds() != null && !request.getTypeIds().isEmpty()) {
            existing.setDishTypes(new HashSet<>(typeRepository.findAllById(request.getTypeIds())));
        } else {
            existing.getDishTypes().clear();
        }

        // ===== 4. Cập nhật DishIngredients =====
        existing.getDishIngredients().clear();

        if (request.getDishIngredients() != null && !request.getDishIngredients().isEmpty()) {
            for (DishIngredientCRUDDishRequest diReq : request.getDishIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(diReq.getIngredientId())
                        .orElseThrow(() -> new NotFoundException("Ingredient not found"));

                existing.getDishIngredients().add(
                        DishIngredient.builder()
                                .dish(existing)
                                .ingredient(ingredient)
                                .quantity(diReq.getQuantity())
                                .build()
                );
            }

            double totalPrice = existing.getDishIngredients().stream()
                    .mapToDouble(di -> di.getQuantity() * di.getIngredient().getPrice())
                    .sum();
            existing.setPrice(totalPrice);
        } else {
            existing.setPrice(0.0);
        }

        // ===== 5. Cập nhật Recipes =====
        existing.getRecipes().clear();

        if (request.getRecipes() != null && !request.getRecipes().isEmpty()) {
            for (RecipeCRUDDishRequest rReq : request.getRecipes()) {
                existing.getRecipes().add(
                        Recipe.builder()
                                .dish(existing)
                                .type(rReq.getType())
                                .step(rReq.getStep())
                                .content(rReq.getContent())
                                .build()
                );
            }
        }

        // ===== 6. Lưu lại toàn bộ =====
        Dish updated = dishRepository.save(existing);

        return DishMapper.toResponse(updated);
    }

    @Override
    public void changeStatusDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dish not found"));
        try {
            if (dish.getStatus() == DishStatus.ACTIVE) {
                dish.setStatus(DishStatus.INACTIVE);
            } else {
                dish.setStatus(DishStatus.ACTIVE);
            }
            dishRepository.save(dish);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to delete dish");
        }
    }

    @Override
    public List<DishSummaryResponse> getAllActiveDishes() {
        try {
            return dishRepository.findAll()
                    .stream()
                    .filter(d -> d.getStatus() == DishStatus.ACTIVE) // chỉ lấy active
                    .map(DishMapper::toSummary)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get dishes");
        }
    }

    @Override
    public List<DishSummaryResponse> getAllDishes() {
        try {
            return dishRepository.findAll()
                    .stream()
                    .map(DishMapper::toSummary)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get dishes");
        }
    }

    @Override
    public DishResponse getDishById(Long id) {
        try {
            Dish dish = dishRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Dish not found or deleted"));
            return DishMapper.toResponse(dish);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ActionFailedException("Failed to get dish");
        }
    }

    @Override
    public List<DishSummaryResponse> getDishByCountryId(Long countryId) {
        return dishRepository.findByCountry_CountryIdAndStatus(countryId, DishStatus.ACTIVE)
                .stream()
                .map(DishMapper::toSummary)
                .toList();
    }

    @Override
    public List<DishSummaryResponse> getDishByTypeId(Long typeId) {
        return dishRepository.findByTypeIdAndStatus(typeId, DishStatus.ACTIVE)
                .stream()
                .map(DishMapper::toSummary)
                .toList();
    }

    @Override
    public List<DishSummaryResponse> getRelatedDishes(Long currentDishId, int limit) {
        List<Dish> availableMeals = dishRepository.findByStatusAndDishIdNot(DishStatus.ACTIVE, currentDishId);

        Collections.shuffle(availableMeals);

        return availableMeals.stream()
                .limit(limit)
                .map(DishMapper::toSummary)
                .toList();
    }

    @Override
    public String uploadDishImage(Long dishId, MultipartFile file) throws IOException {
        try {
            Dish dish = dishRepository.findByDishIdAndStatus(dishId, DishStatus.ACTIVE)
                    .orElseThrow(() -> new NotFoundException("Dish not found or deleted"));
            String imageUrl = s3Service.uploadFile(file);
            dish.setImgUrl(imageUrl);
            dishRepository.save(dish);
            return imageUrl;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ActionFailedException("Failed to get dish");
        }
    }
}
