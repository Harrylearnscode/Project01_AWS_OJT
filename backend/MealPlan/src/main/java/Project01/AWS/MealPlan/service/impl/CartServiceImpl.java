package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.model.dtos.requests.CartRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;
import Project01.AWS.MealPlan.model.entities.Cart;
import Project01.AWS.MealPlan.model.entities.User;
import Project01.AWS.MealPlan.model.exception.ActionFailedException;
import Project01.AWS.MealPlan.model.exception.NotFoundException;
import Project01.AWS.MealPlan.repository.CartRepository;
import Project01.AWS.MealPlan.repository.UserRepository;
import Project01.AWS.MealPlan.service.CartService;
import Project01.AWS.MealPlan.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

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
                .orElseThrow(() -> new NotFoundException(
                        String.format("Cannot find cart with ID: %s", id)
                ));
        try {
            cartRepository.delete(cart);
        } catch (Exception e) {
            throw new ActionFailedException(String.format("Failed to delete cart with ID: %s", id));
        }
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
}
