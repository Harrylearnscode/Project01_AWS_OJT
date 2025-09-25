package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.DishIngredientRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishIngredientResponse;
import Project01.AWS.MealPlan.service.DishIngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dish-ingredients")
@RequiredArgsConstructor
public class DishIngredientController {

    private final DishIngredientService dishIngredientService;

    @PostMapping
    public ResponseEntity<DishIngredientResponse> create(@RequestBody DishIngredientRequest request) {
        return ResponseEntity.ok(dishIngredientService.create(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DishIngredientResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dishIngredientService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<DishIngredientResponse>> getAll() {
        return ResponseEntity.ok(dishIngredientService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishIngredientResponse> update(@PathVariable Long id,
                                                         @RequestBody DishIngredientRequest request) {
        return ResponseEntity.ok(dishIngredientService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        dishIngredientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
