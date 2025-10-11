package Project01.AWS.MealPlan.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;

public interface S3Service {
    public String uploadFile(MultipartFile file) throws IOException;
    public byte[] downloadFile(String fileName);
    String getPublicUrl(String key);
    String getPresignedUrl(String key, Duration expiry);
}
