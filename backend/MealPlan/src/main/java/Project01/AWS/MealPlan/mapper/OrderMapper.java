package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.OrderResponse;
import Project01.AWS.MealPlan.model.entities.Order;

public class OrderMapper {
    public static OrderResponse toDTO(Order entity) {
        if (entity == null) return null;
        return OrderResponse.builder()
                .orderId(entity.getOrderId())
                .address(entity.getAddress())
                .orderTime(entity.getOrderTime())
                .endTime(entity.getEndTime())
                .deliveryPrice(entity.getDeliveryPrice())
                .ingredientsPrice(entity.getIngredientsPrice())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .userId(entity.getUser().getUserId())
                .userName(entity.getUser().getName())
                .build();
    }
}
