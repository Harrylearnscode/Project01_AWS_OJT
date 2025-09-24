package Project01.AWS.MealPlan.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import Project01.AWS.MealPlan.model.dtos.requests.CountryRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CountryResponse;
import Project01.AWS.MealPlan.model.entities.Country;
import Project01.AWS.MealPlan.repository.CountryRepository;
import Project01.AWS.MealPlan.repository.CountryRepository;
import Project01.AWS.MealPlan.service.CountryService;
import Project01.AWS.MealPlan.mapper.CountryMapper;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;

import org.springframework.data.domain.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CountryServiceImpl implements CountryService {
    private final CountryRepository countryRepository;

    @Override
    public CountryResponse createCountry(Country country) {
        try {
            Country saved = countryRepository.save(country);
            return CountryMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create country");
        }
    }

    @Override
    public CountryResponse updateCountry(Long id, Country country) {
        Country existing = countryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find country with ID: %s", id)
                ));
        existing.setName(country.getName());
        existing.setContinent(country.getContinent());
        try {
            Country updated = countryRepository.save(existing);
            return CountryMapper.toResponse(updated);
        } catch (Exception e) {
            throw new ActionFailedException(
                    String.format("Failed to update country with ID: %s", id)
            );
        }
    }

    @Override
    public void deleteCountry(Long id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find country with ID: %s", id)
                ));
        try {
            countryRepository.delete(country);
        } catch (Exception e) {
            throw new ActionFailedException(
                    String.format("Failed to delete country with ID: %s", id)
            );
        }
    }

    @Override
    public List<CountryResponse> getAllCountries() {
        try {
            List<Country> countries = countryRepository.findAll();
            return countries.stream()
                    .map(CountryMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get countries");
        }
    }

    @Override
    public CountryResponse getCountryById(Long id) {
        try {
            Country country = countryRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Country not found"));
            return CountryMapper.toResponse(country);
        } catch (Exception e) {
            throw new ActionFailedException(
                    String.format("Failed to get country with ID: %s", id)
            );
        }
    }
}