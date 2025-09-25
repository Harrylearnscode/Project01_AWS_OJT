package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.model.dtos.requests.CountryRequest;
import Project01.AWS.MealPlan.model.dtos.responses.CountryResponse;
import Project01.AWS.MealPlan.model.dtos.responses.ResponseObject;
import Project01.AWS.MealPlan.model.entities.Country;
import Project01.AWS.MealPlan.service.CountryService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @Operation(summary = "Tạo country", description = "Khởi tạo một country.")
    @PostMapping("/create")
    public ResponseEntity<ResponseObject> createCountry(@RequestBody CountryRequest request) {
        Country entity = Country.builder()
                .name(request.getName())
                .continent(request.getContinent())
                .build();

        CountryResponse response = countryService.createCountry(entity);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("CREATE_SUCCESS")
                        .message("Country created successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Cập nhật country", description = "Chỉnh sửa thông tin country.")
    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseObject> updateCountry(@PathVariable Long id, @RequestBody CountryRequest request) {
        Country entity = Country.builder()
                .name(request.getName())
                .continent(request.getContinent())
                .build();

        CountryResponse response = countryService.updateCountry(id, entity);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("UPDATE_SUCCESS")
                        .message("Country updated successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }

    @Operation(summary = "Xóa một country", description = "Xóa country theo ID.")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseObject> deleteCountry(@PathVariable Long id) {
        countryService.deleteCountry(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("DELETE_SUCCESS")
                        .message("Country deleted successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(null)
                        .build()
        );
    }

    @Operation(summary = "Lấy tất cả country", description = "Trả về danh sách các country.")
    @GetMapping("/getAll")
    public ResponseEntity<ResponseObject> getAllCountries() {
        List<CountryResponse> countries = countryService.getAllCountries();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_LIST_SUCCESS")
                        .message("Get all countries successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(countries)
                        .build()
        );
    }

    @Operation(summary = "Lấy country theo id", description = "Trả về thông tin country theo id.")
    @GetMapping("/getById/{id}")
    public ResponseEntity<ResponseObject> getCountryById(@PathVariable Long id) {
        CountryResponse response = countryService.getCountryById(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("GET_SUCCESS")
                        .message("Get country successfully")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(response)
                        .build()
        );
    }
}
