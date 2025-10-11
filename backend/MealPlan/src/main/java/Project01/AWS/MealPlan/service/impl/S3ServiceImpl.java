package Project01.AWS.MealPlan.service.impl;

import Project01.AWS.MealPlan.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;


import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        String key = file.getOriginalFilename();

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // Return public URL; for private buckets use getPresignedUrl(key, Duration.ofMinutes(15))
        return getPublicUrl(key);
    }

    @Override
    public byte[] downloadFile(String key) {
        ResponseBytes<GetObjectResponse> responseBytes =
                s3Client.getObjectAsBytes(
                        GetObjectRequest.builder()
                                .bucket(bucketName)
                                .key(key)
                                .build()
                );
        return responseBytes.asByteArray();
    }

    @Override
    public String getPublicUrl(String key) {
        String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8).replace("+", "%20");
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + encodedKey;
    }

    // Generate a presigned URL valid for the specified duration(private access)
    @Override
    public String getPresignedUrl(String key, Duration expiry) {
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(expiry)
                .getObjectRequest(GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build())
                .build();

        PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(presignRequest);
        return presigned.url().toString();
    }
}
