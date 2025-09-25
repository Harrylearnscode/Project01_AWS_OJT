package Project01.AWS.MealPlan.controller;


import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import Project01.AWS.MealPlan.model.dtos.requests.TypeRequest;
import Project01.AWS.MealPlan.model.dtos.responses.TypeResponse;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import Project01.AWS.MealPlan.model.entities.Type;
import Project01.AWS.MealPlan.service.TypeService;

import java.util.List;

@RestController
@RequestMapping("/api/type")
@RequiredArgsConstructor
public class TypeController {

    private final TypeService typeService;

    @Operation(summary = "Tạo type", description = "Khởi tạo một type.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createType(@RequestBody TypeRequest request) {
        Type entity = Type.builder()
                .name(request.getName())
                .build();
        TypeResponse response = typeService.createType(entity);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Type created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật type", description = "Chỉnh sửa thông tin type.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateType(@PathVariable Long id, @RequestBody TypeRequest request) {
        Type entity = Type.builder()
                .name(request.getName())
                .build();

        TypeResponse response = typeService.updateType(id, entity);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Type updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa một type", description = "Xóa type theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteType(@PathVariable Long id) {
        typeService.deleteType(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Type deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả type", description = "Trả về danh sách các type.")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllTypes() {
        List<TypeResponse> types = typeService.getAllTypes();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all types successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(types)
                        .build()
        );
    }

    @Operation(summary = "Lấy type theo id", description = "Trả về thông tin type theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getTypeById(@PathVariable Long id) {
        TypeResponse response = typeService.getTypeById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get type successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}