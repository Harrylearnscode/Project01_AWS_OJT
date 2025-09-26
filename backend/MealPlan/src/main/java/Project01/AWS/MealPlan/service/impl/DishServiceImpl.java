package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.DishMapper;
import Project01.AWS.MealPlan.model.dtos.requests.DishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.entities.Country;
import Project01.AWS.MealPlan.model.entities.Dish;
import Project01.AWS.MealPlan.model.entities.Type;
import Project01.AWS.MealPlan.model.enums.DishStatus;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.CountryRepository;
import Project01.AWS.MealPlan.repository.DishRepository;
import Project01.AWS.MealPlan.repository.TypeRepository;
import Project01.AWS.MealPlan.service.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    public DishResponse createDish(DishRequest request) {
        try {
            Country country = countryRepository.findById(request.getCountryId())
                    .orElseThrow(() -> new NotFoundException("Country not found"));

            Dish dish = Dish.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .prepareTime(request.getPrepareTime())
                    .cookingTime(request.getCookingTime())
                    .totalTime(request.getTotalTime())
                    .imgUrl(request.getImgUrl())
                    .price(request.getPrice())
                    .status(DishStatus.ACTIVE)
                    .country(country)
                    .build();

            if (request.getTypeIds() != null && !request.getTypeIds().isEmpty()) {
                dish.setDishTypes(new HashSet<>(typeRepository.findAllById(request.getTypeIds())));
            }

            Dish saved = dishRepository.save(dish);
            return DishMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create dish");
        }
    }

    @Override
    public DishResponse updateDish(Long id, DishRequest request) {
        Dish existing = dishRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dish not found"));

        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new NotFoundException("Country not found"));

        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrepareTime(request.getPrepareTime());
        existing.setCookingTime(request.getCookingTime());
        existing.setTotalTime(request.getTotalTime());
        existing.setImgUrl(request.getImgUrl());
        existing.setPrice(request.getPrice());
        existing.setCountry(country);

        if (request.getTypeIds() != null && !request.getTypeIds().isEmpty()) {
            existing.setDishTypes(new HashSet<>(typeRepository.findAllById(request.getTypeIds())));
        }

        try {
            Dish updated = dishRepository.save(existing);
            return DishMapper.toResponse(updated);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to update dish");
        }
    }

    @Override
    public void deleteDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dish not found"));
        try {
            dish.setStatus(DishStatus.INACTIVE); // soft delete
            dishRepository.save(dish);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to delete dish");
        }
    }

    @Override
    public List<DishResponse> getAllDishes() {
        try {
            return dishRepository.findAll()
                    .stream()
                    .filter(d -> d.getStatus() == DishStatus.ACTIVE) // chỉ lấy active
                    .map(DishMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get dishes");
        }
    }

    @Override
    public DishResponse getDishById(Long id) {
        try {
            Dish dish = dishRepository.findByDishIdAndStatus(id, DishStatus.ACTIVE)
                    .orElseThrow(() -> new NotFoundException("Dish not found or deleted"));
            return DishMapper.toResponse(dish);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ActionFailedException("Failed to get dish");
        }
    }

    @Override
    public List<DishResponse> getDishByCountryId(Long countryId) {
        return dishRepository.findByCountry_CountryIdAndStatus(countryId, DishStatus.ACTIVE)
                .stream()
                .map(DishMapper::toResponse)
                .toList();
    }

    @Override
    public List<DishResponse> getDishByTypeId(Long typeId) {
        return dishRepository.findByTypeIdAndStatus(typeId, DishStatus.ACTIVE)
                .stream()
                .map(DishMapper::toResponse)
                .toList();
    }
}
