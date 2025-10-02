package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.CartDishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartDishResponse;
import Project01.AWS.MealPlan.service.CartDishService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-dish")
@RequiredArgsConstructor
public class CartDishController {

    private final CartDishService cartDishService;

    /*@Operation(summary = "Thêm món vào giỏ")
    @PostMapping("/add")
    public ResponseEntity<ResponseObject> addDishToCart(@RequestBody CartDishRequest request) {
        CartDishResponse response = cartDishService.addDishToCart(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("ADD_SUCCESS")
                .message("Dish added to cart successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }*/

    @Operation(summary = "Cập nhật số lượng món")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        CartDishResponse response = cartDishService.updateQuantity(id, quantity);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("UPDATE_SUCCESS")
                .message("Quantity updated successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Xóa món khỏi giỏ")
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<ResponseObject> removeDishFromCart(@PathVariable Long id) {
        cartDishService.removeDishFromCart(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("DELETE_SUCCESS")
                .message("Dish removed from cart successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(null)
                .build());
    }

    @Operation(summary = "Lấy danh sách món trong giỏ")
    @GetMapping("/getByCart/{cartId}")
    public ResponseEntity<ResponseObject> getDishesByCart(@PathVariable Long cartId) {
        List<CartDishResponse> responses = cartDishService.getDishesByCart(cartId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get dishes in cart successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(responses)
                .build());
    }
}
