package com.saumajit.tprm.grc.service;


import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.security.MessageDigest;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {
    private boolean isMinioAvailable() {
        return minioClient != null;
    }

    private final MinioClient minioClient;

    @Value("${minio.bucket.evidence:evidence-uploads}")
    private String evidenceBucket;

    public String storeFile(MultipartFile file) {
        return uploadFile(file, UUID.randomUUID());
    }

    public String uploadFile(MultipartFile file, UUID batchId) {
        if (!isMinioAvailable()) {
            log.warn("MinIO not available, skipping file upload for: {}", file.getOriginalFilename());
            return "mock-path/" + file.getOriginalFilename();
        }
        try {
            // Ensure bucket exists
            ensureBucketExists(evidenceBucket);

            // Generate unique file path
            String fileName = generateFileName(file.getOriginalFilename(), batchId);

            // Upload file
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(evidenceBucket)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            log.info("File uploaded successfully: {}", fileName);
            return fileName;

        } catch (Exception e) {
            log.error("Error uploading file: {}", e.getMessage(), e);
            throw new RuntimeException("File upload failed", e);
        }
    }

    public String calculateFileHash(MultipartFile file) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(file.getBytes());

            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            log.error("Error calculating file hash: {}", e.getMessage(), e);
            throw new RuntimeException("Hash calculation failed", e);
        }
    }

    public InputStream downloadFile(String fileName) {
        try {
            return minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(evidenceBucket)
                            .object(fileName)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage(), e);
            throw new RuntimeException("File download failed", e);
        }
    }

    private void ensureBucketExists(String bucketName) throws Exception {
        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    private String generateFileName(String originalFileName, UUID batchId) {
        String extension = "";
        int idx = originalFileName.lastIndexOf(".");
        if (idx > 0) {
            extension = originalFileName.substring(idx);
        }
        return String.format("evidence/%s/%s%s", batchId, UUID.randomUUID(), extension);
    }
}
