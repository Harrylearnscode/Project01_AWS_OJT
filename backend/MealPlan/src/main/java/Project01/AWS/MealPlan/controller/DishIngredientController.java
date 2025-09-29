package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.DishIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishIngredientResponse;
import Project01.AWS.MealPlan.service.DishIngredientService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dish-ingredients")
@RequiredArgsConstructor
public class DishIngredientController {

    private final DishIngredientService dishIngredientService;

    @Operation(summary = "Gắn ingredient cho dish", description = "Khởi tạo một country.")
    @PostMapping
    public ResponseEntity<DishIngredientResponse> create(@RequestBody DishIngredientRequest request) {
        return ResponseEntity.ok(dishIngredientService.create(request));
    }

    @Operation(summary = "Lấy dish ingredient bằng id")
    @GetMapping("/{id}")
    public ResponseEntity<DishIngredientResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dishIngredientService.getById(id));
    }

    @Operation(summary = "Lấy tất cả dish ingredient")
    @GetMapping
    public ResponseEntity<List<DishIngredientResponse>> getAll() {
        return ResponseEntity.ok(dishIngredientService.getAll());
    }

    @Operation(summary = "Update lại ingredient gắn cho dish")
    @PutMapping("/{id}")
    public ResponseEntity<DishIngredientResponse> update(@PathVariable Long id,
                                                         @RequestBody DishIngredientRequest request) {
        return ResponseEntity.ok(dishIngredientService.update(id, request));
    }

    @Operation(summary = "Xóa các ingredient gắn cho dish")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dishIngredientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
