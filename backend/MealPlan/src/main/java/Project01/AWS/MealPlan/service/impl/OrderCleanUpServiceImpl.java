package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.service.OrderCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderCleanUpServiceImpl implements OrderCleanupService {
    private final OrderRepository orderRepository;

    private static final int DAYS_TO_KEEP = 7;

    @Transactional
    public void cleanupOldCancelledOrders() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(DAYS_TO_KEEP);

        List<Order> oldCancelledOrders = orderRepository.findCancelledOrdersBefore(cutoffDate);

        if (!oldCancelledOrders.isEmpty()) {
            orderRepository.deleteAll(oldCancelledOrders);
            System.out.println("🧹 Đã xóa " + oldCancelledOrders.size() + " đơn hàng bị hủy quá hạn.");
        }
    }
}
