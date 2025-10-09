package Project01.AWS.MealPlan.repository;

import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedOrderResponse;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_UserId(Long userId);
    @Query("SELECT c FROM Order c WHERE LOWER(c.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);

    // 🧮 Đếm số đơn hủy gần đây của user
    long countByUser_UserIdAndStatusAndCanceledAtAfter(Long userId, OrderStatus status, LocalDateTime after);

    // 🕒 Tìm tất cả đơn có trạng thái nào đó được tạo trước 1 thời điểm nhất định (để auto-cancel chẳng hạn)
    List<Order> findAllByStatusAndOrderTimeBefore(OrderStatus status, LocalDateTime before);

    @Query("SELECT o FROM Order o " +
            "WHERE o.status = 'CANCELLED' " +
            "AND o.orderTime < :cutoffDate")
    List<Order> findCancelledOrdersBefore(@Param("cutoffDate") LocalDateTime cutoffDate);


}
