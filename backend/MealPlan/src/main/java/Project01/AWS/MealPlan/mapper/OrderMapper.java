package Project01.AWS.MealPlan.mapper;

import Project01.AWS.MealPlan.model.dtos.responses.OrderDetailResponse;
import Project01.AWS.MealPlan.model.dtos.responses.OrderDishResponse;
import Project01.AWS.MealPlan.model.dtos.responses.OrderIngredientResponse;
import Project01.AWS.MealPlan.model.dtos.responses.OrderResponse;
import Project01.AWS.MealPlan.model.dtos.responses.OrderStatusResponse;
import Project01.AWS.MealPlan.model.entities.Order;

import java.util.stream.Collectors;

public class OrderMapper {
    public static OrderResponse toDTO(Order entity) {
        if (entity == null) return null;
        return OrderResponse.builder()
                .orderId(entity.getOrderId())
                .address(entity.getAddress())
                .orderTime(entity.getOrderTime())
                .endTime(entity.getEndTime())
                .deliveryPrice(entity.getDeliveryPrice())
                .totalPrice(entity.getTotalPrice())
                .totalCalories(entity.getTotalCalories())
                .status(entity.getStatus())
                .userId(entity.getUser().getUserId())
                .userName(entity.getUser().getName())
                .build();
    }

    public static OrderStatusResponse toStatusResponse(Order order) {
        if (order == null) return null;
        return OrderStatusResponse.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .build();
    }

    public static OrderDetailResponse toResponse(Order order) {
        if(order == null) return null;
        return OrderDetailResponse.builder()
                .orderId(order.getOrderId())
                .address(order.getAddress())
                .phoneNumber(order.getPhoneNumber())
                .canceledReason(order.getCanceledReason())
                .orderTime(order.getOrderTime())
                .canceledAt(order.getCanceledAt())
                .endTime(order.getEndTime())
                .deliveryPrice(order.getDeliveryPrice())
                .totalPrice(order.getTotalPrice())
                .totalCalories(order.getTotalCalories())
                .paidTime(order.getPaidTime())
                .status(order.getStatus())
                .userName(order.getUser().getName())
                .dishes(order.getOrderDishes().stream()
                        .map(od -> OrderDishResponse.builder()
                                .id(od.getId())
                                .orderId(order.getOrderId())
                                .dishId(od.getDish().getDishId())
                                .dishName(od.getDish().getName())
                                .quantity(od.getQuantity())
                                .imgUrl(od.getDish().getImgUrl())
                                .ingredients(od.getIngredients().stream()
                                        .map(oi -> OrderIngredientResponse.builder()
                                                .id(oi.getId())
                                                .orderDishId(od.getId())
                                                .ingredientId(oi.getIngredient().getIngredientId())
                                                .ingredientName(oi.getIngredient().getName())
                                                .quantity(oi.getQuantity())
                                                .build())
                                        .collect(Collectors.toSet()))
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }
}
