package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.AddDishToCartRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CartDishRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CartRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UpdateDishInCartRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;
import Project01.AWS.MealPlan.service.CartDishService;
import Project01.AWS.MealPlan.service.CartService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final CartDishService cartDishService;

    @Operation(summary = "Tạo giỏ hàng", description = "Khởi tạo giỏ hàng cho user.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createCart(@RequestBody CartRequest request) {
        CartResponse response = cartService.createCart(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Cart created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật giỏ hàng", description = "Chỉnh sửa user gắn với giỏ hàng.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateCart(@PathVariable Long id, @RequestBody CartRequest request) {
        CartResponse response = cartService.updateCart(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Cart updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa giỏ hàng", description = "Xóa giỏ hàng theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Cart deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả giỏ hàng", description = "Trả về danh sách giỏ hàng")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllCarts() {
        List<CartResponse> carts = cartService.getAllCarts();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all carts successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(carts)
                        .build()
        );
    }

    @Operation(summary = "Lấy giỏ hàng theo id", description = "Trả về thông tin giỏ hàng theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getCartById(@PathVariable Long id) {
        CartResponse response = cartService.getCartById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get cart successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Lấy giỏ hàng theo userId", description = "Trả về giỏ hàng của một user.")
    @GetMapping("/getByUser/{userId}")
    public ResponseEntity<ResponseObject> getCartByUserId(@PathVariable Long userId) {
        CartResponse response = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get cart by userId successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Thêm món vào giỏ hàng", description = "Thêm một món ăn (dish) vào giỏ của user.")
    @PostMapping("/{userId}/add")
    public ResponseEntity<ResponseObject> addDishToCart(
            @PathVariable Long userId,
            @RequestBody AddDishToCartRequest request) {
        cartService.addDishToCart(userId, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("ADD_SUCCESS")
                        .message("Dish added to cart successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Xóa món khỏi giỏ hàng", description = "Xóa một món khỏi giỏ dựa trên dishId.")
    @DeleteMapping("/{cartDishId}/remove/")
    public ResponseEntity<ResponseObject> removeDishFromCart(
            @PathVariable Long cartDishId) {
        cartService.removeDishFromCart(cartDishId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("REMOVE_SUCCESS")
                        .message("Dish removed from cart successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật số lượng món trong giỏ", description = "Thay đổi quantity của một dish trong giỏ.")
    @PutMapping("/{userId}/update")
    public ResponseEntity<ResponseObject> updateDishQuantity(
            @RequestBody UpdateDishInCartRequest request) {
        cartService.updateDishInCart(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Dish quantity updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Checkout giỏ hàng", description = "Tiến hành checkout giỏ hàng theo cartId và userId, tạo order và trừ kho.")
    @PostMapping("/{userId}/checkout/{cartId}")
    public ResponseEntity<ResponseObject> checkout(
            @PathVariable Long userId,
            @PathVariable Long cartId) {
        cartService.checkout(cartId, userId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CHECKOUT_SUCCESS")
                        .message("Checkout successfully, order created")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

}
