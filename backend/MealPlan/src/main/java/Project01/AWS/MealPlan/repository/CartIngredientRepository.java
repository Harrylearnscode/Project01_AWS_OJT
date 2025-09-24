package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.CartIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartIngredientRepository extends JpaRepository<CartIngredient, Long> {
    List<CartIngredient> findByCart_CartId(Long cartId);
    Optional<CartIngredient> findByCart_CartIdAndIngredient_IngredientId(Long cartId, Long ingredientId);
}
