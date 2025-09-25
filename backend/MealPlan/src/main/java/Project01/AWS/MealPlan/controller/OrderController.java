package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.OrderResponse;
import Project01.AWS.MealPlan.service.OrderService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "Tạo đơn hàng mới")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createOrder(@RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("CREATE_SUCCESS")
                .message("Order created successfully")
                .status(HttpStatus.CREATED)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Cập nhật trạng thái đơn hàng")
    @PutMapping("/update-status/{orderId}")
    public ResponseEntity<ResponseObject> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        OrderResponse response = orderService.updateStatus(orderId, status);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("UPDATE_SUCCESS")
                .message("Order status updated successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Hủy đơn hàng (soft delete)")
    @DeleteMapping("/cancel/{orderId}")
    public ResponseEntity<ResponseObject> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("CANCEL_SUCCESS")
                .message("Order cancelled successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(null)
                .build());
    }

    @Operation(summary = "Lấy danh sách đơn hàng theo user")
    @GetMapping("/by-user/{userId}")
    public ResponseEntity<ResponseObject> getOrdersByUser(@PathVariable Long userId) {
        List<OrderResponse> responses = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get orders by user successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(responses)
                .build());
    }

    @Operation(summary = "Lấy tất cả đơn hàng")
    @GetMapping("/all")
    public ResponseEntity<ResponseObject> getAllOrders() {
        List<OrderResponse> responses = orderService.getAllOrders();
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get all orders successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(responses)
                .build());
    }
}
