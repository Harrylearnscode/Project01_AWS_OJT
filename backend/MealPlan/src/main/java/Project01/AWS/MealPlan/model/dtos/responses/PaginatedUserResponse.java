package Project01.AWS.MealPlan.model.dtos.responses;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedUserResponse {
    private List<UserResponse> users;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
