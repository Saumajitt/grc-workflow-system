package com.saumajit.tprm.grc.config;
import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class FileStorageConfig {

    @Value("${minio.endpoint:http://localhost:9000}")
    private String minioEndpoint;

    @Value("${minio.access.key:minioadmin}")
    private String accessKey;

    @Value("${minio.secret.key:minioadmin}")
    private String secretKey;

    @Bean
    @ConditionalOnProperty(name = "minio.enabled", havingValue = "true", matchIfMissing = true)
    public MinioClient minioClient() {
            return MinioClient.builder()
                    .endpoint(minioEndpoint)
                    .credentials(accessKey, secretKey)
                    .build();

    }
}
