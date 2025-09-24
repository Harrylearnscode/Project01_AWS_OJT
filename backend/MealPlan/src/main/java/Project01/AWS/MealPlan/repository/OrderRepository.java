package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);
    List<Order> findByStatus(OrderStatus status);
}
