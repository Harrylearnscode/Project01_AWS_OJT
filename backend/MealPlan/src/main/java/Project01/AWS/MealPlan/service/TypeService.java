package Project01.AWS.MealPlan.service;

import Project01.AWS.MealPlan.model.entities.Type;
import org.springframework.web.multipart.MultipartFile;
import Project01.AWS.MealPlan.model.dtos.requests.TypeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.TypeResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TypeService{
    TypeResponse createType(Type typeEntity);
    TypeResponse updateType(Long id, Type typeEntity);
    void deleteType(Long id);
    List<TypeResponse> getAllTypes();
    TypeResponse getTypeById(Long id);
}
