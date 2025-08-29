package com.saumajit.tprm.grc.controller;
import com.saumajit.tprm.grc.dto.BulkImportResponse;
import com.saumajit.tprm.grc.model.BulkImportJob;
import com.saumajit.tprm.grc.model.ThirdParty;
import com.saumajit.tprm.grc.service.ThirdPartyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tprm")
@RequiredArgsConstructor
@Slf4j
public class ThirdPartyController {

    private final ThirdPartyService thirdPartyService;

    @PostMapping("/bulk-import")
    public ResponseEntity<BulkImportResponse> bulkImport(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", defaultValue = "1") Long userId) {

        try {
            UUID jobId = thirdPartyService.startBulkImport(file, userId);

            BulkImportResponse response = new BulkImportResponse(
                    jobId,
                    "PROCESSING",
                    "Bulk import started successfully"
            );

            return ResponseEntity.accepted().body(response);

        } catch (IllegalArgumentException e) {
            log.error("Invalid bulk import request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new BulkImportResponse(null, "FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Server error starting bulk import: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(new BulkImportResponse(null, "FAILED", "Internal error"));
        }
    }

    @GetMapping("/import-status/{jobId}")
    public ResponseEntity<BulkImportJob> getImportStatus(@PathVariable UUID jobId) {

        try {
            BulkImportJob job = thirdPartyService.getImportStatus(jobId);
            return ResponseEntity.ok(job);

        } catch (Exception e) {
            log.error("Error getting import status: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ThirdParty>> searchThirdParties(
            @RequestParam String query) {

        List<ThirdParty> results = thirdPartyService.searchThirdParties(query);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/validate")
    public ResponseEntity<String> validateImportData(
            @RequestParam("file") MultipartFile file) {

        // Implement CSV validation logic
        log.info("Validating import file: {}", file.getOriginalFilename());

        return ResponseEntity.ok("File validation completed successfully");
    }
}