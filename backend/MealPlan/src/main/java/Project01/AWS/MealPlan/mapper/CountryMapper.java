package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.CountryResponse;
import Project01.AWS.MealPlan.model.entities.Country;

public class CountryMapper {

    public static CountryResponse toResponse(Country entity) {
        if (entity == null) return null;
        return CountryResponse.builder()
                .id(entity.getCountryId())
                .name(entity.getName())
                .continent(entity.getContinent())
                .build();
    }
}
