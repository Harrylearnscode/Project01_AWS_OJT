package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.enums.DishStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import Project01.AWS.MealPlan.model.entities.Dish;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    Optional<Dish> findByDishIdAndStatus(Long dishId, DishStatus status);
    List<Dish> findByCountry_CountryIdAndStatus(Long countryId, DishStatus status);

    @Query("SELECT d FROM Dish d JOIN d.dishTypes t WHERE t.typeId = :typeId AND d.status = :status")
    List<Dish> findByTypeIdAndStatus(Long typeId, DishStatus status);

    List<Dish> findByStatusAndDishIdNot(DishStatus status, Long dishId);
}