package com.saumajit.tprm.grc.controller;

import com.saumajit.tprm.grc.dto.EvidenceBatchUploadResponse;
import com.saumajit.tprm.grc.dto.EvidenceUploadResponse;
import com.saumajit.tprm.grc.dto.MultipleEvidenceUploadRequest;
import com.saumajit.tprm.grc.model.EvidenceUpload;
import com.saumajit.tprm.grc.model.User;
import com.saumajit.tprm.grc.service.EvidenceProcessingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evidence")
@RequiredArgsConstructor
@Slf4j
public class EvidenceController {

    private final EvidenceProcessingService evidenceProcessingService;

    @PostMapping("/upload")
    public ResponseEntity<EvidenceUploadResponse> uploadEvidence(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "evidenceType") EvidenceUpload.EvidenceType evidenceType,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "questionnaireId", required = false) Long questionnaireId,
            @RequestParam(value = "questionId", required = false) Long questionId,
            Authentication authentication) {

        try {
            User user = (User) authentication.getPrincipal();
            UUID batchId = evidenceProcessingService.processEvidenceUpload(
                file, categoryId, evidenceType, description, tags, 
                questionnaireId, questionId, user
            );

            EvidenceUploadResponse response = new EvidenceUploadResponse(
                    batchId,
                    "PROCESSING",
                    "Evidence upload started successfully"
            );

            return ResponseEntity.accepted().body(response);

        } catch (IllegalArgumentException e) {
            log.error("Invalid evidence upload request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new EvidenceUploadResponse(null, "FAILED", e.getMessage()));
        } catch (Exception e) {
            log.error("Server error during evidence upload: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(new EvidenceUploadResponse(null, "FAILED", "Internal error"));
        }
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<EvidenceBatchUploadResponse> uploadMultipleEvidence(
            @RequestParam("files") MultipartFile[] files,
            @Valid @ModelAttribute MultipleEvidenceUploadRequest request,
            Authentication authentication) {

        try {
            User user = (User) authentication.getPrincipal();
            EvidenceBatchUploadResponse response = evidenceProcessingService.processMultipleEvidenceUpload(
                files, request, user
            );

            return ResponseEntity.accepted().body(response);

        } catch (IllegalArgumentException e) {
            log.error("Invalid multiple evidence upload request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                new EvidenceBatchUploadResponse(null, "FAILED", e.getMessage(), 
                    files.length, 0, files.length, List.of(), List.of())
            );
        } catch (Exception e) {
            log.error("Server error during multiple evidence upload: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(
                new EvidenceBatchUploadResponse(null, "FAILED", "Internal server error", 
                    files.length, 0, files.length, List.of(), List.of())
            );
        }
    }

    @GetMapping("/batch-status/{batchId}")
    public ResponseEntity<List<EvidenceUpload>> getBatchStatus(@PathVariable String batchId) {
        try {
            List<EvidenceUpload> evidenceList = evidenceProcessingService.getEvidenceByBatchId(batchId);
            return ResponseEntity.ok(evidenceList);
        } catch (Exception e) {
            log.error("Error getting evidence batch status: {}", e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/types")
    public ResponseEntity<EvidenceUpload.EvidenceType[]> getEvidenceTypes() {
        return ResponseEntity.ok(EvidenceUpload.EvidenceType.values());
    }

    @GetMapping("/policy-types")
    public ResponseEntity<EvidenceUpload.PolicyType[]> getPolicyTypes() {
        return ResponseEntity.ok(EvidenceUpload.PolicyType.values());
    }

    @GetMapping("/my-uploads")
    public ResponseEntity<List<EvidenceUpload>> getMyUploads(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            List<EvidenceUpload> uploads = evidenceProcessingService.getEvidenceByUser(user.getId());
            return ResponseEntity.ok(uploads);
        } catch (Exception e) {
            log.error("Error getting user uploads: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveEvidence(@PathVariable Long id, Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            evidenceProcessingService.approveEvidence(id, user);
            return ResponseEntity.ok("Evidence approved successfully");
        } catch (Exception e) {
            log.error("Error approving evidence: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to approve evidence");
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectEvidence(
            @PathVariable Long id, 
            @RequestParam String reason,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            evidenceProcessingService.rejectEvidence(id, reason, user);
            return ResponseEntity.ok("Evidence rejected successfully");
        } catch (Exception e) {
            log.error("Error rejecting evidence: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Failed to reject evidence");
        }
    }
}