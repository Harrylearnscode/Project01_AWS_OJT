package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.OrderDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDishRepository extends JpaRepository<OrderDish, Long> {
    List<OrderDish> findByOrder_OrderId(Long orderId);
}
