package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.DishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.service.DishService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DishController {

    private final DishService dishService;

    @Operation(summary = "Tạo dish", description = "Khởi tạo một dish mới.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createDish(@RequestBody DishRequest request) {
        DishResponse response = dishService.createDish(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Dish created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật dish", description = "Chỉnh sửa thông tin dish.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateDish(@PathVariable Long id, @RequestBody DishRequest request) {
        DishResponse response = dishService.updateDish(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Dish updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa dish (soft delete)", description = "Đánh dấu dish INACTIVE thay vì xóa hẳn.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteDish(@PathVariable Long id) {
        dishService.deleteDish(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Dish deleted successfully (soft delete)")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả dish ACTIVE", description = "Trả về danh sách dish đang ACTIVE.")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllDishes(
    ) {
        List<DishResponse> responses = dishService.getAllDishes();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all dishes successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(responses)
                        .build()
        );
    }

    @Operation(summary = "Lấy dish theo id", description = "Trả về thông tin dish theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getDishById(@PathVariable Long id) {
        DishResponse response = dishService.getDishById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get dish successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}
