package com.saumajit.tprm.grc.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;
    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();

        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                status.put("database", "UP");
            } else {
                status.put("database", "DOWN");
            }
        } catch (Exception e) {
            status.put("database", "DOWN");
        }

        try {
            // Check Redis connectivity
            redisTemplate.opsForValue().set("health-check", "test");
            status.put("redis", "UP");
        } catch (Exception e) {
            status.put("redis", "DOWN");
        }

        status.put("application", "UP");
        status.put("timestamp", String.valueOf(System.currentTimeMillis()));

        return ResponseEntity.ok(status);
    }
}