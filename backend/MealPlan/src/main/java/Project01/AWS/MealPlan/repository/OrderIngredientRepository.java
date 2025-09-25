package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.OrderIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderIngredientRepository extends JpaRepository<OrderIngredient, Long> {
    List<OrderIngredient> findByOrder_OrderId(Long orderId);
}
