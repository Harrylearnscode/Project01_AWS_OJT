package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.CartDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartDishRepository extends JpaRepository<CartDish, Long>{
    List<CartDish> findByCart_CartId(Long cartId);
    Optional<CartDish> findByCart_CartIdAndDish_DishId(Long cartId, Long dishId);
}
