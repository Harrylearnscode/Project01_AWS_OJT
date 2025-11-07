package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.DishRequest;
import Project01.AWS.MealPlan.model.dtos.responses.DishResponse;
import Project01.AWS.MealPlan.model.dtos.responses.DishSummaryResponse;
import Project01.AWS.MealPlan.service.DishService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.io.IOException;
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

    @Operation(summary = "Đổi status(Active, InActive)")
    @PutMapping("/changestatus/{id}")
    public ResponseEntity<ResponseObject> changeStatusDish(@PathVariable Long id) {
        dishService.changeStatusDish(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CHANGE_STATUS_SUCCESS")
                        .message("Change dish status successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả dish ACTIVE", description = "Trả về danh sách dish đang ACTIVE.")
    @GetMapping("/getAllActiveDishes")
    public ResponseEntity<ResponseObject> getAllActiveDishes(
    ) {
        List<DishSummaryResponse> responses = dishService.getAllActiveDishes();
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

    @Operation(summary = "Lấy tất cả dish", description = "Trả về danh sách dish.")
    @GetMapping("/getAllDishes")
    public ResponseEntity<ResponseObject> getAllDishes(
    ) {
        List<DishSummaryResponse> responses = dishService.getAllDishes();
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

    @Operation(summary = "Lấy dish theo countryId", description = "Trả về danh sách dish thuộc 1 country cụ thể.")
    @GetMapping("/getByCountry/{countryId}")
    public ResponseEntity<ResponseObject> getDishByCountryId(@PathVariable Long countryId) {
        List<DishSummaryResponse> responses = dishService.getDishByCountryId(countryId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get dishes by country successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(responses)
                        .build()
        );
    }

    @Operation(summary = "Lấy dish theo typeId", description = "Trả về danh sách dish thuộc 1 type cụ thể.")
    @GetMapping("/getByType/{typeId}")
    public ResponseEntity<ResponseObject> getDishByTypeId(@PathVariable Long typeId) {
        List<DishSummaryResponse> responses = dishService.getDishByTypeId(typeId);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get dishes by type successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(responses)
                        .build()
        );
    }

    @Operation(summary = "Lấy danh sách món liên quan", description = "Trả về danh sách dish liên quan (ngẫu nhiên), loại bỏ dish hiện tại.")
    @GetMapping("/{id}/related")
    public ResponseEntity<ResponseObject> getRelatedDishes(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {

        List<DishSummaryResponse> responses = dishService.getRelatedDishes(id, limit);

        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get related dishes successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(responses)
                        .build()
        );
    }

    @Operation(summary = "Upload dish image to S3", description = "Tải ảnh món ăn lên S3 và cập nhật URL vào dish.")
    @PostMapping(value = "/{dishId}/uploadImage", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> uploadDishImage(
            @PathVariable Long dishId,
            @Parameter(
                    description = "Image file",
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary")
                    )
            )
            @RequestParam("image") MultipartFile file) throws IOException {
        String imageUrl = dishService.uploadDishImage(dishId, file);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPLOAD_SUCCESS")
                        .message("Dish image uploaded successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(imageUrl)
                        .build()
        );
    }

}
