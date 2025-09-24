package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.CartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartIngredientResponse;
import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.entities.CartIngredient;
import Project01.AWS.MealPlan.model.entities.Ingredient;
import Project01.AWS.MealPlan.mapper.CartIngredientMapper;
import Project01.AWS.MealPlan.repository.CartIngredientRepository;
import Project01.AWS.MealPlan.repository.CartRepository;
import Project01.AWS.MealPlan.repository.IngredientRepository;
import Project01.AWS.MealPlan.service.CartIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartIngredientServiceImpl implements CartIngredientService {

    private final CartIngredientRepository cartIngredientRepository;
    private final CartRepository cartRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    public CartIngredientResponse addIngredientToCart(CartIngredientRequest request) {
        Cart cart = cartRepository.findById(request.getCartId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        // Nếu đã có thì update số lượng
        CartIngredient entity = cartIngredientRepository.findByCart_CartIdAndIngredient_IngredientId(
                        cart.getCartId(), ingredient.getIngredientId())
                .orElse(CartIngredient.builder()
                        .cart(cart)
                        .ingredient(ingredient)
                        .quantity(0)
                        .build());

        entity.setQuantity(entity.getQuantity() + request.getQuantity());

        return CartIngredientMapper.toDTO(cartIngredientRepository.save(entity));
    }

    @Override
    public CartIngredientResponse updateQuantity(Long id, Integer quantity) {
        CartIngredient entity = cartIngredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartIngredient not found"));
        entity.setQuantity(quantity);
        return CartIngredientMapper.toDTO(cartIngredientRepository.save(entity));
    }

    @Override
    public void removeIngredientFromCart(Long id) {
        cartIngredientRepository.deleteById(id);
    }

    @Override
    public List<CartIngredientResponse> getIngredientsByCart(Long cartId) {
        return cartIngredientRepository.findByCart_CartId(cartId).stream()
                .map(CartIngredientMapper::toDTO)
                .collect(Collectors.toList());
    }
}
