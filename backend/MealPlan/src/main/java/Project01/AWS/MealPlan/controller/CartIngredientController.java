package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.UpdateCartIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartIngredientResponse;
import Project01.AWS.MealPlan.service.CartIngredientService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-ingredient")
@RequiredArgsConstructor
public class CartIngredientController {

    private final CartIngredientService cartIngredientService;

    @Operation(summary = "Thêm nguyên liệu vào giỏ")
    @PostMapping("/add")
    public ResponseEntity<ResponseObject> addIngredientToCart(@RequestBody UpdateCartIngredientRequest request) {
        CartIngredientResponse response = cartIngredientService.addIngredientToCart(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("ADD_SUCCESS")
                .message("Ingredient added to cart successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Cập nhật số lượng nguyên liệu")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        CartIngredientResponse response = cartIngredientService.updateQuantity(id, quantity);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("UPDATE_SUCCESS")
                .message("Quantity updated successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Xóa nguyên liệu khỏi giỏ")
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<ResponseObject> removeIngredientFromCart(@PathVariable Long id) {
        cartIngredientService.removeIngredientFromCart(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("DELETE_SUCCESS")
                .message("Ingredient removed from cart successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(null)
                .build());
    }

    @Operation(summary = "Lấy danh sách nguyên liệu trong giỏ")
    @GetMapping("/getByCartDish/{cartDishId}")
    public ResponseEntity<ResponseObject> getIngredientsByCartDish(@PathVariable Long cartDishId) {
        List<CartIngredientResponse> responses = cartIngredientService.getIngredientsByCartDish(cartDishId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get ingredients in cart dish successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(responses)
                .build());
    }

}
