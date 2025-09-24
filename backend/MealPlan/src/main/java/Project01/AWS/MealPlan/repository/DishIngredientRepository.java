package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {
}
