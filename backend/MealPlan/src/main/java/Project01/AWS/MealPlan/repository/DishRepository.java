package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.enums.DishStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import Project01.AWS.MealPlan.model.entities.Dish;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    Optional<Dish> findByDishIdAndStatus(Long dishId, DishStatus status);
}