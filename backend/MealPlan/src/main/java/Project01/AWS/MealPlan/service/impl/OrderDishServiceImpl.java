package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.OrderDishMapper;
import Project01.AWS.MealPlan.model.dtos.requests.OrderDishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderDishResponse;
import Project01.AWS.MealPlan.model.entities.Dish;
import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.entities.OrderDish;
import Project01.AWS.MealPlan.repository.DishRepository;
import Project01.AWS.MealPlan.repository.OrderDishRepository;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.service.OrderDishService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderDishServiceImpl implements OrderDishService {

    private final OrderDishRepository orderDishRepository;
    private final OrderRepository orderRepository;
    private final DishRepository dishRepository;

    @Override
    public OrderDishResponse addDishToOrder(OrderDishRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        OrderDish orderDish = OrderDish.builder()
                .order(order)
                .dish(dish)
                .quantity(request.getQuantity())
                .build();

        return OrderDishMapper.toDTO(orderDishRepository.save(orderDish));
    }

    @Override
    public OrderDishResponse updateQuantity(Long id, Integer quantity) {
        OrderDish orderDish = orderDishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDish not found"));
        orderDish.setQuantity(quantity);
        return OrderDishMapper.toDTO(orderDishRepository.save(orderDish));
    }

    @Override
    public void removeDishFromOrder(Long id) {
        orderDishRepository.deleteById(id);
    }

    @Override
    public List<OrderDishResponse> getDishesByOrder(Long orderId) {
        return orderDishRepository.findByOrder_OrderId(orderId).stream()
                .map(OrderDishMapper::toDTO)
                .collect(Collectors.toList());
    }
}
