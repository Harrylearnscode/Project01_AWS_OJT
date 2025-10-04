package Project01.AWS.MealPlan.mapper;

import java.util.LinkedHashMap;
import Project01.AWS.MealPlan.model.dtos.responses.DishIngredientSimpleResponse;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.dtos.responses.DishSummaryResponse;
import Project01.AWS.MealPlan.model.entities.Dish;
import Project01.AWS.MealPlan.model.entities.Recipe;
import Project01.AWS.MealPlan.model.entities.Type;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DishMapper {
    public static DishResponse toResponse(Dish dish) {
        if (dish == null) return null;

        // Ingredients mapping
        List<DishIngredientSimpleResponse> ingredients = dish.getDishIngredients().stream()
                .map(di -> DishIngredientSimpleResponse.builder()
                        .ingredientId(di.getIngredient().getIngredientId())
                        .ingredient(di.getIngredient().getName())
                        .quantity(di.getQuantity())
                        .unit(di.getIngredient().getUnit())
                        .price(di.getIngredient().getPrice())
                        .calories(di.getIngredient().getCalories())
                        .build())
                .toList();

        // Types mapping
        List<String> types = dish.getDishTypes().stream()
                .map(Type::getName)
                .toList();

        // Recipes grouped by type and sorted by step
        Map<String, List<String>> recipes = dish.getRecipes().stream()
                .sorted(Comparator.comparing(Recipe::getStep)) // sắp xếp theo step
                .collect(Collectors.groupingBy(
                        Recipe::getType,
                        LinkedHashMap::new,
                        Collectors.mapping(Recipe::getContent, Collectors.toList())
                ));

        return DishResponse.builder()
                .id(dish.getDishId())
                .name(dish.getName())
                .description(dish.getDescription())
                .prepareTime(dish.getPrepareTime())
                .cookingTime(dish.getCookingTime())
                .totalTime(dish.getTotalTime())
                .imgUrl(dish.getImgUrl())
                .price(dish.getPrice())
                .country(dish.getCountry().getName())
                .types(types)
                .dishIngredients(ingredients)
                .recipes(recipes)
                .build();
    }

    public static DishSummaryResponse toSummary(Dish dish) {
        if (dish == null) return null;

        // Types mapping
        List<String> types = dish.getDishTypes().stream()
                .map(Type::getName)
                .toList();

        return DishSummaryResponse.builder()
                .id(dish.getDishId())
                .name(dish.getName())
                .description(dish.getDescription())
                .prepareTime(dish.getPrepareTime())
                .cookingTime(dish.getCookingTime())
                .totalTime(dish.getTotalTime())
                .imgUrl(dish.getImgUrl())
                .price(dish.getPrice())
                .country(dish.getCountry() != null ? dish.getCountry().getName() : null)
                .types(types)
                .build();
    }
}
