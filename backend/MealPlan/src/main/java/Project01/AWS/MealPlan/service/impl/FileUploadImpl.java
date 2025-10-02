package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.service.FileUploadService;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadImpl implements FileUploadService {

    private final Cloudinary cloudinary;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"};

    @Override
    public String uploadFile(MultipartFile multipartFile) throws IOException {
        // Validate file
        validateFile(multipartFile);

        Map<String, Object> uploadParams = new HashMap<>();
        uploadParams.put("resource_type", "image");
        uploadParams.put("folder", "meal-plan");
        uploadParams.put("quality", "auto");
        uploadParams.put("fetch_format", "auto");

        Map<String, Object> uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), uploadParams);
        return (String) uploadResult.get("secure_url");
    }

    private void validateFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("Vui lòng chọn một hình ảnh để tải lên.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IOException("Kích thước file không được vượt quá 5MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !isValidImageType(contentType)) {
            throw new IOException("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP).");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new IOException("Tên file không hợp lệ.");
        }
    }

    private boolean isValidImageType(String contentType) {
        for (String allowedType : ALLOWED_TYPES) {
            if (allowedType.equals(contentType)) {
                return true;
            }
        }
        return false;
    }
}
