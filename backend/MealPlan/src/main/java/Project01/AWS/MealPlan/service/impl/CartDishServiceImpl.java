package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.CartDishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartDishResponse;
import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.entities.CartDish;
import Project01.AWS.MealPlan.model.entities.Dish;
import Project01.AWS.MealPlan.mapper.CartDishMapper;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.CartDishRepository;
import Project01.AWS.MealPlan.repository.CartRepository;
import Project01.AWS.MealPlan.repository.DishRepository;
import Project01.AWS.MealPlan.service.CartDishService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartDishServiceImpl implements CartDishService {

    private final CartDishRepository cartDishRepository;
    private final CartRepository cartRepository;
    private final DishRepository dishRepository;

    /*@Override
    public CartDishResponse addDishToCart(CartDishRequest request) {
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new RuntimeException("Dish not found"));

        // Kiểm tra nếu món đã có trong giỏ -> update quantity
        CartDish entity = cartDishRepository.findByCart_CartIdAndDish_DishId(cart.getCartId(), dish.getDishId())
                .orElse(CartDish.builder()
                        .cart(cart)
                        .dish(dish)
                        .quantity(0)
                        .build());

        entity.setQuantity(entity.getQuantity() + request.getQuantity());

        return CartDishMapper.toDTO(cartDishRepository.save(entity));
    }*/

    @Override
    public CartDishResponse updateQuantity(Long id, Integer quantity) {
        CartDish entity = cartDishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartDish not found"));
        entity.setQuantity(quantity);
        return CartDishMapper.toDTO(cartDishRepository.save(entity));
    }

    @Override
    public void removeDishFromCart(Long id) {
        cartDishRepository.deleteById(id);
    }

    @Override
    public List<CartDishResponse> getDishesByCart(Long cartId) {
        return cartDishRepository.findByCart_CartId(cartId).stream()
                .map(CartDishMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Double getCartDishTotalPrice(Long cartDishId) {
        CartDish cartDish = cartDishRepository.findById(cartDishId)
                .orElseThrow(() -> new NotFoundException("CartDish not found"));

        double ingredientCost = cartDish.getIngredients().stream()
                .mapToDouble(ci -> ci.getQuantity() * ci.getIngredient().getPrice())
                .sum();

        return ingredientCost * cartDish.getQuantity();
    }
}
