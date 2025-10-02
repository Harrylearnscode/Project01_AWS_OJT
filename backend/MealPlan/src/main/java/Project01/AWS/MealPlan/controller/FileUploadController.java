package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/image-upload")
@RequiredArgsConstructor
public class FileUploadController {
    private final FileUploadService fileUploadService;
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image) {

        try {
            String imageUrl = fileUploadService.uploadFile(image);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tải lên hình ảnh thành công.");
            response.put("imageUrl", imageUrl);
            response.put("fileName", image.getOriginalFilename());
            response.put("fileSize", image.getSize());

            return ResponseEntity.ok(response);

        } catch (IOException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", "Lỗi server: " + ex.getMessage()));
        }
    }
}
