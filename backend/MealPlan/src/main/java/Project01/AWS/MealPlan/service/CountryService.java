package Project01.AWS.MealPlan.service;

import org.springframework.web.multipart.MultipartFile;
import Project01.AWS.MealPlan.model.dtos.requests.CountryRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CountryResponse;
import org.springframework.data.domain.Pageable;
import Project01.AWS.MealPlan.model.entities.Country;

import java.util.List;
public interface CountryService{
    CountryResponse createCountry(Country country);
    CountryResponse updateCountry(Long id, Country country);
    void deleteCountry(Long id);
    List<CountryResponse> getAllCountries();
    CountryResponse getCountryById(Long id);
}
