package Project01.AWS.MealPlan.scheduler;

import Project01.AWS.MealPlan.service.OrderCleanupService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@EnableScheduling
@Service
@RequiredArgsConstructor
public class ScheduledCleanupTask {

    private final OrderCleanupService orderCleanupService;

    // Chạy 2 giờ sáng mỗi ngày
    @Scheduled(cron = "0 0 2 * * *", zone = "Asia/Ho_Chi_Minh")
    public void runCleanupTask() {
        orderCleanupService.cleanupOldCancelledOrders();
    }
}
