package Project01.AWS.MealPlan.controller;

import Project01.AWS.MealPlan.service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3service;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image to S3")
    public ResponseEntity<String> upload(
            @Parameter(
                    description = "Image file",
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary")
                    )
            )
            @RequestParam("image") MultipartFile image) throws IOException {

        String url = s3service.uploadFile(image); // public URL (or swap to presigned)
        return ResponseEntity.ok(url);
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<byte[]> download(@PathVariable String fileName) {
        byte[] data = s3service.downloadFile(fileName);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .body(data);
    }
}
