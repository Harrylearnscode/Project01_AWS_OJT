package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.RecipeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.RecipeResponse;
import Project01.AWS.MealPlan.service.RecipeService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @Operation(summary = "Tạo recipe", description = "Khởi tạo một recipe mới.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createRecipe(@RequestBody RecipeRequest request) {
        RecipeResponse response = recipeService.createRecipe(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Recipe created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật recipe", description = "Chỉnh sửa thông tin recipe.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateRecipe(@PathVariable Long id, @RequestBody RecipeRequest request) {
        RecipeResponse response = recipeService.updateRecipe(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Recipe updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa recipe", description = "Xóa recipe theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Recipe deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả recipes", description = "Trả về danh sách recipes.")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllRecipes() {
        List<RecipeResponse> responses = recipeService.getAllRecipes();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all recipes successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(responses)
                        .build()
        );
    }

    @Operation(summary = "Lấy recipe theo id", description = "Trả về thông tin recipe theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getRecipeById(@PathVariable Long id) {
        RecipeResponse response = recipeService.getRecipeById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get recipe successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}
