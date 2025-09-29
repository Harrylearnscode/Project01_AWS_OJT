package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.AddDishToCartRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UpdateCartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CartRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;
import Project01.AWS.MealPlan.model.entities.*;
import Project01.AWS.MealPlan.model.enums.OrderStatus;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.*;
import Project01.AWS.MealPlan.service.CartService;
import Project01.AWS.MealPlan.service.CartDishService;
import Project01.AWS.MealPlan.service.CartIngredientService;
import Project01.AWS.MealPlan.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final CartDishRepository cartDishRepository;
    private final CartDishService cartDishService;
    private final CartIngredientService cartIngredientService;
    private final IngredientRepository ingredientRepository;
    private final DishRepository dishRepository;
    private final CartIngredientRepository cartIngredientRepository;
    private final OrderRepository orderRepository;
    private final OrderDishRepository orderDishRepository;
    private final OrderIngredientRepository orderIngredientRepository;

    @Override
    public CartResponse createCart(CartRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new NotFoundException("User not found"));
            Cart cart = Cart.builder()
                    .user(user)
                    .build();
            Cart saved = cartRepository.save(cart);
            return CartMapper.toResponse(saved);
        } catch (Exception e) {
            throw new ActionFailedException("Failed to create cart");
        }
    }

    @Override
    public CartResponse updateCart(Long id, CartRequest request) {
        Cart existing = cartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find cart with ID: %s", id)
                ));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        existing.setUser(user);
        try {
            Cart updated = cartRepository.save(existing);
            return CartMapper.toResponse(updated);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to update cart with ID: %s", id));
        }
    }

    @Override
    public void deleteCart(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Cannot find cart with ID: " + id));

        User user = cart.getUser();
        if (user != null) {
            user.setCarts(null);
            cart.setUser(null);
        }

        cartRepository.delete(cart);
        cartRepository.flush();
    }

    @Override
    public List<CartResponse> getAllCarts() {
        try {
            return cartRepository.findAll().stream()
                    .map(CartMapper::toResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ActionFailedException("Failed to get carts");
        }
    }

    @Override
    public CartResponse getCartById(Long id) {
        try {
            Cart cart = cartRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Cart not found"));
            return CartMapper.toResponse(cart);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get cart with ID: %s", id));
        }
    }

    @Override
    public CartResponse getCartByUserId(Long userId) {
        try {
            Cart cart = cartRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new NotFoundException("Cart not found for user"));
            return CartMapper.toResponse(cart);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to get cart for userId: %s", userId));
        }
    }

    @Override
    public void addDishToCart(Long userId, AddDishToCartRequest request) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(userRepository.findById(userId)
                                        .orElseThrow(() -> new NotFoundException("User not found")))
                                .build()
                ));

        // 2. Tạo CartDish mới
        CartDish cartDish = CartDish.builder()
                .cart(cart)
                .dish(dishRepository.findById(request.getDishId())
                        .orElseThrow(() -> new NotFoundException("Dish not found")))
                .quantity(request.getQuantity())
                .build();
        cartDish = cartDishRepository.save(cartDish);

        // 3. Nếu có ingredients thì thêm vào luôn
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            for (CartIngredientRequest ingReq : request.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(ingReq.getIngredientId())
                        .orElseThrow(() -> new NotFoundException("Ingredient not found"));

                CartIngredient cartIngredient = CartIngredient.builder()
                        .cartDish(cartDish)
                        .ingredient(ingredient)
                        .quantity(ingReq.getQuantity())
                        .build();

                cartIngredientRepository.save(cartIngredient);
            }
        }
    }



    @Override
    public void removeDishFromCart(Long userId, Long dishId) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new NotFoundException("Cart not found for user"));

        CartDish cartDish = cartDishRepository.findByCart_CartIdAndDish_DishId(
                cart.getCartId(), dishId
        ).orElseThrow(() -> new NotFoundException("Dish not found in cart"));

        // Gọi CartDishService
        cartDishService.removeDishFromCart(cartDish.getId());
    }

    @Override
    @Transactional
    public void updateDishInCart(Long userId, AddDishToCartRequest request) {
        // 1. Tìm cart theo user
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new NotFoundException("Cart not found for user"));

        // 2. Lấy CartDish trong cart
        CartDish cartDish = cartDishRepository.findByCart_CartIdAndDish_DishId(
                cart.getCartId(), request.getDishId()
        ).orElseThrow(() -> new NotFoundException("Dish not found in cart"));

        // 3. Cập nhật số lượng dish
        cartDish.setQuantity(request.getQuantity());
        cartDishRepository.save(cartDish);

        // 4. Nếu có ingredients thì update
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            for (CartIngredientRequest ingReq : request.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(ingReq.getIngredientId())
                        .orElseThrow(() -> new NotFoundException("Ingredient not found"));

                CartIngredient cartIngredient = cartIngredientRepository
                        .findByCartDish_IdAndIngredient_IngredientId(cartDish.getId(), ingredient.getIngredientId())
                        .orElse(CartIngredient.builder()
                                .cartDish(cartDish)
                                .ingredient(ingredient)
                                .quantity(0)
                                .build());

                cartIngredient.setQuantity(ingReq.getQuantity());
                cartIngredientRepository.save(cartIngredient);
            }
        }
    }

    public void checkout(Long cartId, Long userId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Set<CartDish> cartDishes = cart.getCartDishes();

        // 1. Check stock
        for (CartDish cd : cartDishes) {
            Dish dish = cd.getDish();

            for (DishIngredient di : dish.getDishIngredients()) {
                Ingredient ingredient = di.getIngredient();

                int baseQty = di.getQuantity();
                int delta = cd.getIngredients().stream()
                        .filter(ci -> ci.getIngredient().equals(ingredient))
                        .mapToInt(CartIngredient::getQuantity)
                        .sum();

                int requiredPerDish = baseQty + delta;
                int totalRequired = requiredPerDish * cd.getQuantity();

                if (ingredient.getStock() < totalRequired) {
                    throw new RuntimeException("Out of stock: " + ingredient.getName());
                }
            }
        }

        // 2. Trừ stock
        for (CartDish cd : cartDishes) {
            Dish dish = cd.getDish();

            for (DishIngredient di : dish.getDishIngredients()) {
                Ingredient ingredient = di.getIngredient();

                int baseQty = di.getQuantity();
                int delta = cd.getIngredients().stream()
                        .filter(ci -> ci.getIngredient().equals(ingredient))
                        .mapToInt(CartIngredient::getQuantity)
                        .sum();

                int requiredPerDish = baseQty + delta;
                int totalRequired = requiredPerDish * cd.getQuantity();

                ingredient.setStock(ingredient.getStock() - totalRequired);
                ingredientRepository.save(ingredient);
            }
        }

        // 3. Tạo Order
        Order order = Order.builder()
                .user(cart.getUser())
                .status(OrderStatus.PENDING)
                .totalPrice(0.0)
                .build();
        orderRepository.save(order);

        double totalPrice = 0.0;

        // 4. Tạo OrderDish + OrderIngredient
        for (CartDish cd : cartDishes) {
            double adjustedDishPrice = cd.getDish().getPrice();

            OrderDish od = OrderDish.builder()
                    .order(order)
                    .dish(cd.getDish())
                    .quantity(cd.getQuantity())
                    .build();
            orderDishRepository.save(od);

            for (DishIngredient di : cd.getDish().getDishIngredients()) {
                Ingredient ingredient = di.getIngredient();

                int baseQty = di.getQuantity();
                int delta = cd.getIngredients().stream()
                        .filter(ci -> ci.getIngredient().equals(ingredient))
                        .mapToInt(CartIngredient::getQuantity)
                        .sum();

                int actualQty = baseQty + delta;

                // Lưu OrderIngredient
                OrderIngredient oi = OrderIngredient.builder()
                        .orderDish(od)
                        .ingredient(ingredient)
                        .quantity(actualQty * cd.getQuantity())
                        .build();
                orderIngredientRepository.save(oi);

                // tính tiền từ delta
                adjustedDishPrice += delta * ingredient.getPrice();
            }

            totalPrice += adjustedDishPrice * cd.getQuantity();
        }

        order.setTotalPrice(totalPrice);
        orderRepository.save(order);

        // 5. Xóa cart
        cart.getCartDishes().clear();
        cartRepository.save(cart);
    }
}
