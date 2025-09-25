package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.OrderDishResponse;
import Project01.AWS.MealPlan.model.entities.OrderDish;

public class OrderDishMapper {
    public static OrderDishResponse toDTO(OrderDish entity) {
        if (entity == null) return null;
        return OrderDishResponse.builder()
                .id(entity.getId())
                .orderId(entity.getOrder().getOrderId())
                .dishId(entity.getDish().getDishId())
                .dishName(entity.getDish().getName())
                .quantity(entity.getQuantity())
                .build();
    }
}
