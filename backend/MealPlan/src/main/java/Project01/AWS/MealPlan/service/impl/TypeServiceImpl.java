package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.TypeMapper;
import Project01.AWS.MealPlan.model.dtos.responses.TypeResponse;
import Project01.AWS.MealPlan.model.entities.Type;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.TypeRepository;
import Project01.AWS.MealPlan.service.TypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TypeServiceImpl implements TypeService {

    private final TypeRepository typeRepository;

    @Override
    public TypeResponse createType(Type typeEntity) {
        try {
            Type saved = typeRepository.save(typeEntity);
            return TypeMapper.toDTO(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create type");
        }
    }

    @Override
    public TypeResponse updateType(Long id, Type typeEntity) {
        Type existing = typeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find type with ID: %s", id)
                ));
        existing.setName(typeEntity.getName());
        try {
            Type updated = typeRepository.save(existing);
            return TypeMapper.toDTO(updated);
        } catch (Exception e) {
            throw new ActionFailedException(
                    String.format("Failed to update type with ID: %s", id)
            );
        }
    }

    @Override
    public void deleteType(Long id) {
        Type typeEntity = typeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find type with ID: %s", id)
                ));
        try {
            typeRepository.delete(typeEntity);
        } catch (Exception e) {
            throw new ActionFailedException(
                    String.format("Failed to delete type with ID: %s", id)
            );
        }
    }

    @Override
    public List<TypeResponse> getAllTypes() {
        try {
            List<Type> typees = typeRepository.findAll();
            return typees.stream()
                    .map(TypeMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get typees");
        }
    }

    @Override
    public TypeResponse getTypeById(Long id) {
        try {
            Type typeEntity = typeRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Type not found"));
            return TypeMapper.toDTO(typeEntity);
        } catch (Exception e) {
            throw new ActionFailedException(
                    String.format("Failed to get type with ID: %s", id)
            );
        }
    }
}
