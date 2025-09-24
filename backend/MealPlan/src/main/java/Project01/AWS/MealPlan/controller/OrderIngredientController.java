package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.OrderIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderIngredientResponse;
import Project01.AWS.MealPlan.service.OrderIngredientService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-ingredients")
@RequiredArgsConstructor
public class OrderIngredientController {

    private final OrderIngredientService orderIngredientService;

    @Operation(summary = "Thêm nguyên liệu vào order")
    @PostMapping("/add")
    public ResponseEntity<ResponseObject> addIngredient(@RequestBody OrderIngredientRequest request) {
        OrderIngredientResponse response = orderIngredientService.addIngredientToOrder(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("ADD_SUCCESS")
                .message("Ingredient added to order successfully")
                .status(HttpStatus.CREATED)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Cập nhật số lượng nguyên liệu trong order")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        OrderIngredientResponse response = orderIngredientService.updateQuantity(id, quantity);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("UPDATE_SUCCESS")
                .message("Quantity updated successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Xóa nguyên liệu khỏi order")
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<ResponseObject> removeIngredient(@PathVariable Long id) {
        orderIngredientService.removeIngredientFromOrder(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("REMOVE_SUCCESS")
                .message("Ingredient removed from order successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(null)
                .build());
    }

    @Operation(summary = "Lấy danh sách nguyên liệu theo order")
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<ResponseObject> getIngredientsByOrder(@PathVariable Long orderId) {
        List<OrderIngredientResponse> responses = orderIngredientService.getIngredientsByOrder(orderId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get ingredients by order successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(responses)
                .build());
    }
}
