package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.entities.Dish;

import java.util.stream.Collectors;

public class DishMapper {
    public static DishResponse toResponse(Dish entity) {
        if (entity == null) return null;
        return DishResponse.builder()
                .dishId(entity.getDishId())
                .name(entity.getName())
                .description(entity.getDescription())
                .prepareTime(entity.getPrepareTime())
                .cookingTime(entity.getCookingTime())
                .totalTime(entity.getTotalTime())
                .imgUrl(entity.getImgUrl())
                .price(entity.getPrice())
                .status(entity.getStatus())
                .countryId(entity.getCountry() != null ? entity.getCountry().getCountryId() : null)
                .countryName(entity.getCountry() != null ? entity.getCountry().getName() : null)
                .typeNames(entity.getDishTypes().stream().map(t -> t.getName()).collect(Collectors.toSet()))
                .build();
    }
}
