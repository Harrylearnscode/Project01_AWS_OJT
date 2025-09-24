package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.CartRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CartResponse;
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
}
