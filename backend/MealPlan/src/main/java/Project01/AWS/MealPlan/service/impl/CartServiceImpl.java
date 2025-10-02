package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.AddDishToCartRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UpdateCartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UpdateDishInCartRequest;
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
import java.util.Map;
import java.util.Optional;
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

    public void addDishToCart(Long userId, AddDishToCartRequest request) {
        Cart cart = cartRepository.findByUser_UserId(userId)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(userRepository.findById(userId)
                                        .orElseThrow(() -> new NotFoundException("User not found")))
                                .build()
                ));

        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new NotFoundException("Dish not found"));

        List<CartDish> existingCartDishes = cartDishRepository.findByCart_CartIdAndDish_DishId(
                cart.getCartId(),
                request.getDishId()
        );

        // Chuẩn hoá ingredients từ request (nếu null thì coi như empty)
        List<CartIngredientRequest> reqIngredients =
                request.getIngredients() != null ? request.getIngredients() : List.of();

        CartDish matchedCartDish = null;

        // So sánh với từng cartDish hiện có
        for (CartDish cd : existingCartDishes) {
            Set<CartIngredient> cartIngs = cartIngredientRepository.findByCartDish(cd);

            boolean same = compareIngredients(cartIngs, reqIngredients);
            if (same) {
                matchedCartDish = cd;
                break;
            }
        }

        if (matchedCartDish != null) {
            // Nếu tìm thấy bản giống hệt → tăng số lượng cartDish
            matchedCartDish.setQuantity(matchedCartDish.getQuantity() + request.getQuantity());
            cartDishRepository.save(matchedCartDish);
        } else {
            // Nếu không có bản nào giống → tạo mới cartDish
            CartDish newCartDish = CartDish.builder()
                    .cart(cart)
                    .dish(dish)
                    .quantity(request.getQuantity())
                    .build();
            newCartDish = cartDishRepository.save(newCartDish);

            // Insert CartIngredient cho cartDish mới
            for (CartIngredientRequest ingReq : reqIngredients) {
                Ingredient ingredient = ingredientRepository.findById(ingReq.getIngredientId())
                        .orElseThrow(() -> new NotFoundException("Ingredient not found"));

                dish.getDishIngredients().stream()
                        .filter(di -> di.getIngredient().getIngredientId().equals(ingReq.getIngredientId()))
                        .findFirst()
                        .orElseThrow(() -> new NotFoundException("DishIngredient not found for this dish"));

                CartIngredient cartIngredient = CartIngredient.builder()
                        .cartDish(newCartDish)
                        .ingredient(ingredient)
                        .quantity(ingReq.getQuantity())
                        .build();
                cartIngredientRepository.save(cartIngredient);
            }
        }
    }

    public void updateDishInCart(UpdateDishInCartRequest request) {
        CartDish cartDish = cartDishRepository.findById(request.getCartDishId())
                .orElseThrow(() -> new NotFoundException("CartDish not found"));

        Long cartId = cartDish.getCart().getCartId();
        Long dishId = request.getDishId();

        // Tìm cartDish trùng: cùng cartId, dishId và nguyên liệu giống nhau
        Optional<CartDish> existingCartDishOpt = cartDishRepository.findByCart_CartIdAndDish_DishId(cartId, dishId)
                .stream()
                .filter(cd -> compareIngredients(cd.getIngredients(), request.getIngredients()))
                .findFirst();

        if (existingCartDishOpt.isPresent()) {
            CartDish existingCartDish = existingCartDishOpt.get();

            if (!existingCartDish.getId().equals(cartDish.getId())) {
                // Gộp quantity
                existingCartDish.setQuantity(existingCartDish.getQuantity() + request.getQuantity());
                cartDishRepository.save(existingCartDish);

                // Xóa cartDish cũ và nguyên liệu liên quan để tránh duplicate key
                cartIngredientRepository.deleteAll(cartDish.getIngredients());
                cartDishRepository.delete(cartDish);
            } else {
                // Cập nhật quantity và nguyên liệu
                cartDish.setQuantity(request.getQuantity());
                updateCartIngredients(cartDish, request.getIngredients());
                cartDishRepository.save(cartDish);
            }
        } else {
            // Không trùng => update bình thường
            cartDish.setQuantity(request.getQuantity());
            cartDish.setDish(dishRepository.findById(dishId)
                    .orElseThrow(() -> new NotFoundException("Dish not found")));
            updateCartIngredients(cartDish, request.getIngredients());
            cartDishRepository.save(cartDish);
        }
    }


    private boolean compareIngredients(Set<CartIngredient> cartIngs, List<CartIngredientRequest> reqIngs) {
        if (cartIngs.size() != reqIngs.size()) return false;

        Map<Long, Integer> cartMap = cartIngs.stream()
                .collect(Collectors.toMap(ci -> ci.getIngredient().getIngredientId(), CartIngredient::getQuantity));

        for (CartIngredientRequest req : reqIngs) {
            Integer qty = cartMap.get(req.getIngredientId());
            if (qty == null || !qty.equals(req.getQuantity())) {
                return false;
            }
        }
        return true;
    }

    private void updateCartIngredients(CartDish cartDish, List<CartIngredientRequest> ingredientRequests) {
        // Lấy danh sách nguyên liệu hiện tại
        Map<Long, CartIngredient> existingIngredients = cartDish.getIngredients()
                .stream()
                .collect(Collectors.toMap(ci -> ci.getIngredient().getIngredientId(), ci -> ci));

        for (CartIngredientRequest req : ingredientRequests) {
            Ingredient ingredient = ingredientRepository.findById(req.getIngredientId())
                    .orElseThrow(() -> new NotFoundException("Ingredient not found"));

            if (existingIngredients.containsKey(req.getIngredientId())) {
                // Cập nhật quantity nếu đã tồn tại
                CartIngredient existing = existingIngredients.get(req.getIngredientId());
                existing.setQuantity(req.getQuantity());
                cartIngredientRepository.save(existing);

                existingIngredients.remove(req.getIngredientId()); // Đánh dấu đã xử lý
            } else {
                // Thêm mới nguyên liệu
                CartIngredient newIngredient = CartIngredient.builder()
                        .cartDish(cartDish)
                        .ingredient(ingredient)
                        .quantity(req.getQuantity())
                        .build();
                cartIngredientRepository.save(newIngredient);
            }
        }

        // Xóa những nguyên liệu không còn trong request
        for (CartIngredient toRemove : existingIngredients.values()) {
            cartIngredientRepository.delete(toRemove);
        }
    }

    @Override
    public void removeDishFromCart(Long cartDishId) {
        CartDish cartDish = cartDishRepository.findById(cartDishId)
                .orElseThrow(() -> new NotFoundException("Dish not found in cart"));
        cartDishRepository.delete(cartDish); // Hibernate cascade sẽ xóa nguyên liệu
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
