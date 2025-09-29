package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.UpdateCartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartIngredientResponse;
import Project01.AWS.MealPlan.model.entities.CartDish;
import Project01.AWS.MealPlan.model.entities.CartIngredient;
import Project01.AWS.MealPlan.model.entities.Ingredient;
import Project01.AWS.MealPlan.mapper.CartIngredientMapper;
import Project01.AWS.MealPlan.repository.CartDishRepository;
import Project01.AWS.MealPlan.repository.CartIngredientRepository;
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
    private final CartDishRepository cartDishRepository;
    private final IngredientRepository ingredientRepository;

    @Override
    public CartIngredientResponse addIngredientToCart(UpdateCartIngredientRequest request) {
        CartDish cartDish = cartDishRepository.findById(request.getCartDishId())
                .orElseThrow(() -> new RuntimeException("CartDish not found"));
        Ingredient ingredient = ingredientRepository.findById(request.getIngredientId())
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        CartIngredient entity = cartIngredientRepository
                .findByCartDish_IdAndIngredient_IngredientId(
                        cartDish.getId(), ingredient.getIngredientId())
                .orElse(CartIngredient.builder()
                        .cartDish(cartDish)
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
    public List<CartIngredientResponse> getIngredientsByCartDish(Long cartDishId) {
        return cartIngredientRepository.findByCartDish_Id(cartDishId).stream()
                .map(CartIngredientMapper::toDTO)
                .collect(Collectors.toList());
    }
}
