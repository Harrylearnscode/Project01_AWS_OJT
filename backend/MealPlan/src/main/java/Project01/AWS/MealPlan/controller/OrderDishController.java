package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.OrderDishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderDishResponse;
import Project01.AWS.MealPlan.service.OrderDishService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-dishes")
@RequiredArgsConstructor
public class OrderDishController {

    private final OrderDishService orderDishService;

    @Operation(summary = "Thêm món ăn vào order")
    @PostMapping("/add")
    public ResponseEntity<ResponseObject> addDish(@RequestBody OrderDishRequest request) {
        OrderDishResponse response = orderDishService.addDishToOrder(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("ADD_SUCCESS")
                .message("Dish added to order successfully")
                .status(HttpStatus.CREATED)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Cập nhật số lượng món trong order")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        OrderDishResponse response = orderDishService.updateQuantity(id, quantity);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("UPDATE_SUCCESS")
                .message("Quantity updated successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Xóa món khỏi order")
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<ResponseObject> removeDish(@PathVariable Long id) {
        orderDishService.removeDishFromOrder(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("REMOVE_SUCCESS")
                .message("Dish removed from order successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(null)
                .build());
    }

    @Operation(summary = "Lấy danh sách món theo order")
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<ResponseObject> getDishesByOrder(@PathVariable Long orderId) {
        List<OrderDishResponse> responses = orderDishService.getDishesByOrder(orderId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get dishes by order successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(responses)
                .build());
    }
}
