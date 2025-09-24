package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.IngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.IngredientResponse;
import Project01.AWS.MealPlan.service.IngredientService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @Operation(summary = "Tạo ingredient", description = "Khởi tạo một ingredient mới.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createIngredient(@RequestBody IngredientRequest request) {
        IngredientResponse response = ingredientService.createIngredient(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Ingredient created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật ingredient", description = "Chỉnh sửa thông tin ingredient.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateIngredient(@PathVariable Long id, @RequestBody IngredientRequest request) {
        IngredientResponse response = ingredientService.updateIngredient(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Ingredient updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa ingredient", description = "Xóa ingredient theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteIngredient(@PathVariable Long id) {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Ingredient deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả ingredients", description = "Trả về danh sách ingredients.")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllIngredients() {
        List<IngredientResponse> responses = ingredientService.getAllIngredients();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all ingredients successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(responses)
                        .build()
        );
    }

    @Operation(summary = "Lấy ingredient theo id", description = "Trả về thông tin ingredient theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getIngredientById(@PathVariable Long id) {
        IngredientResponse response = ingredientService.getIngredientById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get ingredient successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}
