package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.OrderIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderIngredientRepository extends JpaRepository<OrderIngredient, Long> {
    List<OrderIngredient> findByOrderDish_Id(Long orderDishId);
    Optional<OrderIngredient> findByOrderDish_IdAndIngredient_IngredientId(Long orderDishId, Long ingredientId);
}
