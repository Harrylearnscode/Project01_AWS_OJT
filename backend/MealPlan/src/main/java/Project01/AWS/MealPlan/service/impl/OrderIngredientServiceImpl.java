package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.mapper.OrderIngredientMapper;
import Project01.AWS.MealPlan.model.dtos.requests.OrderIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderIngredientResponse;
import Project01.AWS.MealPlan.model.entities.Ingredient;
import Project01.AWS.MealPlan.model.entities.Order;
import Project01.AWS.MealPlan.model.entities.OrderIngredient;
import Project01.AWS.MealPlan.repository.IngredientRepository;
import Project01.AWS.MealPlan.repository.OrderIngredientRepository;
import Project01.AWS.MealPlan.repository.OrderRepository;
import Project01.AWS.MealPlan.service.OrderIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderIngredientServiceImpl implements OrderIngredientService {

    private final OrderIngredientRepository orderIngredientRepository;
    private final OrderRepository orderRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    public OrderIngredientResponse addIngredientToOrder(OrderIngredientRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        OrderIngredient orderIngredient = OrderIngredient.builder()
                .order(order)
                .ingredient(ingredient)
                .quantity(request.getQuantity())
                .build();

        return OrderIngredientMapper.toDTO(orderIngredientRepository.save(orderIngredient));
    }

    @Override
    public OrderIngredientResponse updateQuantity(Long id, Integer quantity) {
        OrderIngredient orderIngredient = orderIngredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderIngredient not found"));
        orderIngredient.setQuantity(quantity);
        return OrderIngredientMapper.toDTO(orderIngredientRepository.save(orderIngredient));
    }

    @Override
    public void removeIngredientFromOrder(Long id) {
        orderIngredientRepository.deleteById(id);
    }

    @Override
    public List<OrderIngredientResponse> getIngredientsByOrder(Long orderId) {
        return orderIngredientRepository.findByOrder_OrderId(orderId).stream()
                .map(OrderIngredientMapper::toDTO)
                .collect(Collectors.toList());
    }
}
