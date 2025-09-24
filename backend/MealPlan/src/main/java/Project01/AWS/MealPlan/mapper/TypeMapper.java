package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.TypeResponse;
import Project01.AWS.MealPlan.model.entities.Type;

public class TypeMapper {

    public static TypeResponse toDTO(Type entity) {
        if (entity == null) return null;
        return TypeResponse.builder()
                .id(entity.getTypeId())
                .name(entity.getName())
                .build();
    }
}
