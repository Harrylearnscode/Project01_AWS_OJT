package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedOrderResponse;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);
    @Query("SELECT c FROM Order c WHERE LOWER(c.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);
}
