package Project01.AWS.MealPlan.controller;


import Project01.AWS.MealPlan.model.dtos.requests.AdminUserRequest;
import Project01.AWS.MealPlan.model.dtos.requests.CognitoUserRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UserPhoneAndAddressRequest;
import Project01.AWS.MealPlan.model.dtos.requests.UserRequest;
import Project01.AWS.MealPlan.model.dtos.responses.PaginatedUserResponse;
import Project01.AWS.MealPlan.model.dtos.responses.UserResponse;
import Project01.AWS.MealPlan.service.UserService;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @Operation(summary = "Tạo user", description = "Khởi tạo một user.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createUser(@RequestBody UserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("User created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật user", description = "Chỉnh sửa thông tin user.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("User updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa user", description = "Safe delete user (chuyển status sang DELETED).")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("User deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả user", description = "Trả về danh sách user search là email. Sort mặc định là userId." +
            " Sort(cần nhập đúng) bao gồm userId, name, phone, address, email, role, active.")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllUsers(
            @RequestParam(value = "search", required = false) String search,
            @ParameterObject
            @PageableDefault(page = 0, size = 10)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "userId", direction = Sort.Direction.ASC)
            }) Pageable pageable) {
        PaginatedUserResponse userResponse = userService.getAllUsers(search, pageable);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all users successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(userResponse)
                        .build()
        );
    }

    @Operation(summary = "Lấy user theo id", description = "Trả về thông tin user theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get user successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Tạo user role Admin", description = "Khởi tạo một user Admin (only Seller should be able to do this).")
    @PostMapping("/createUserAdmin")
    public ResponseEntity<ResponseObject> createUserAdmin(@RequestBody AdminUserRequest request) {
        UserResponse response = userService.createAdmin(request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("User created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật số điện thoại và địa chỉ user sau khi tao account AWS Cognito", description = "Chỉnh sửa số điện thoại và địa chỉ của user.")
    @PostMapping("/updatePhoneNumberAndAddress/{id}")
    public ResponseEntity<ResponseObject> updatePhoneNumberAndAddress(@RequestBody UserPhoneAndAddressRequest request, @PathVariable Long id) {
        UserResponse response = userService.updatePhoneAndAddress(id, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("User updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật info user", description = "Chỉnh sửa thông tin user Cognito.")
    @PutMapping("/updateCognitoUser/{sub}")
    public ResponseEntity<ResponseObject> updateCognitoUserLocalDB(@PathVariable String sub, @RequestBody CognitoUserRequest request) {
        UserResponse response = userService.updateCognitoUser(sub, request);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("User updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Enable user", description = "Enable user (chuyển status ACTIVE sang True).")
    @PatchMapping("/enable/{id}")
    public ResponseEntity<ResponseObject> enableUser(@PathVariable Long id) {
        userService.enableUser(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("ENABLE_SUCCESS")
                        .message("User enabled successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }
}
