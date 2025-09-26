package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedOrderResponse {
    private List<OrderResponse> orders;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
