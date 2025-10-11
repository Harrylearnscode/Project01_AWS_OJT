package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.OrderCancelRequest;
import Project01.AWS.MealPlan.model.dtos.requests.OrderRequest;
import Project01.AWS.MealPlan.model.dtos.responses.*;
import Project01.AWS.MealPlan.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
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
    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<ResponseObject> cancelOrder(
            @PathVariable Long orderId,
            @RequestParam Long userId,
            @RequestBody OrderCancelRequest cancelRequest) {

        orderService.cancelOrder(orderId, userId, cancelRequest.getReason());

        return ResponseEntity.ok(ResponseObject.builder()
                .code("CANCEL_SUCCESS")
                .message("Order cancelled successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
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

    @Operation(summary = "Lấy tất cả đơn hàng", description = "Trả về danh sách order search là address. Sort mặc định là orderId." +
            " Sort(cần nhập đúng) bao gồm orderId, address, orderTime, endTime, status, deliveryPrice, ingredientsPrice, totalPrice, user.userId.")
    @GetMapping("/all")
    public ResponseEntity<ResponseObject> getAllOrders(
        @RequestParam(value = "search", required = false) String search,
        @ParameterObject
        @PageableDefault(page = 0, size = 10)
        @SortDefault.SortDefaults({
                @SortDefault(sort = "orderId", direction = Sort.Direction.ASC)
                }) Pageable pageable) {
            PaginatedOrderResponse orderResponse = orderService.getAllOrders(search, pageable);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("GET_LIST_SUCCESS")
                .message("Get all orders successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(orderResponse)
                .build());
    }

    @Operation(summary = "Checkout giỏ hàng", description = "Tiến hành checkout giỏ hàng theo cartId và userId, tạo order và trừ kho.")
    @PostMapping("/{userId}/checkout/{cartId}")
    public ResponseEntity<ResponseObject> checkout(
            @RequestBody OrderRequest request) {
        OrderResponse response = orderService.checkout(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .code("CHECKOUT_SUCCESS")
                .message("Order created successfully")
                .status(HttpStatus.OK)
                .isSuccess(true)
                .data(response)
                .build());
    }

    @Operation(summary = "Lấy đơn hàng theo id", description = "Trả về thông tin đơn hàng theo id.")
    @GetMapping("/getByOrderId/{orderId}")
    public ResponseEntity<ResponseObject> getOrderById(@PathVariable Long orderId) {
        OrderDetailResponse response = orderService.getOrderByOrderId(orderId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get order successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}
