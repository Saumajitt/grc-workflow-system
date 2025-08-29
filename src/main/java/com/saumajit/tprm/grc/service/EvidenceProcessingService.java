package com.saumajit.tprm.grc.service;

import com.saumajit.tprm.grc.dto.EvidenceBatchUploadResponse;
import com.saumajit.tprm.grc.dto.MultipleEvidenceUploadRequest;
import com.saumajit.tprm.grc.model.EvidenceUpload;
import com.saumajit.tprm.grc.model.User;
import com.saumajit.tprm.grc.repository.EvidenceUploadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvidenceProcessingService {

    private final EvidenceUploadRepository evidenceUploadRepository;
    private final FileStorageService fileStorageService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public UUID processEvidenceUpload(MultipartFile file, Long categoryId, 
            EvidenceUpload.EvidenceType evidenceType, String description, String tags,
            Long questionnaireId, Long questionId, User user) {
        try {
            String batchId = UUID.randomUUID().toString();
            
            // Store file
            String filePath = fileStorageService.storeFile(file);
            
            // Create evidence record
            EvidenceUpload evidence = new EvidenceUpload();
            evidence.setBatchId(batchId);
            evidence.setFileName(generateUniqueFileName(file.getOriginalFilename()));
            evidence.setOriginalFileName(file.getOriginalFilename());
            evidence.setFilePath(filePath);
            evidence.setFileSize(file.getSize());
            evidence.setContentType(file.getContentType());
            evidence.setEvidenceType(evidenceType);
            evidence.setDescription(description);
            evidence.setTags(tags);
            evidence.setQuestionnaireId(questionnaireId);
            evidence.setQuestionId(questionId);
            evidence.setUploadedBy(user);
            evidence.setStatus(EvidenceUpload.ProcessingStatus.PENDING);
            
            EvidenceUpload saved = evidenceUploadRepository.save(evidence);
            
            // Send to Kafka for processing
            kafkaTemplate.send("evidence-processing", saved);
            
            log.info("Evidence upload initiated: {} by user: {}", saved.getId(), user.getUsername());
            return UUID.fromString(batchId);
            
        } catch (Exception e) {
            log.error("Error processing evidence upload: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process evidence upload", e);
        }
    }

    @Transactional
    public EvidenceBatchUploadResponse processMultipleEvidenceUpload(
            MultipartFile[] files, MultipleEvidenceUploadRequest request, User user) {
        
        String batchId = UUID.randomUUID().toString();
        List<String> successfulFiles = new ArrayList<>();
        List<String> failedFiles = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                // Store file
                String filePath = fileStorageService.storeFile(file);
                
                // Create evidence record
                EvidenceUpload evidence = new EvidenceUpload();
                evidence.setBatchId(batchId);
                evidence.setFileName(generateUniqueFileName(file.getOriginalFilename()));
                evidence.setOriginalFileName(file.getOriginalFilename());
                evidence.setFilePath(filePath);
                evidence.setFileSize(file.getSize());
                evidence.setContentType(file.getContentType());
                evidence.setEvidenceType(request.getEvidenceType());
                evidence.setApplicablePolicies(request.getApplicablePolicies());
                evidence.setDescription(request.getDescription());
                evidence.setTags(request.getTags());
                evidence.setQuestionnaireId(request.getQuestionnaireId());
                evidence.setQuestionId(request.getQuestionId());
                evidence.setUploadedBy(user);
                evidence.setStatus(EvidenceUpload.ProcessingStatus.PENDING);
                
                EvidenceUpload saved = evidenceUploadRepository.save(evidence);
                
                // Send to Kafka for processing
                kafkaTemplate.send("evidence-processing", saved);
                
                successfulFiles.add(file.getOriginalFilename());
                log.info("Evidence uploaded successfully: {} in batch: {}", saved.getId(), batchId);
                
            } catch (Exception e) {
                failedFiles.add(file.getOriginalFilename());
                log.error("Failed to upload evidence: {} - {}", file.getOriginalFilename(), e.getMessage());
            }
        }
        
        return new EvidenceBatchUploadResponse(
            batchId,
            "PROCESSING",
            String.format("Batch upload completed: %d successful, %d failed", 
                successfulFiles.size(), failedFiles.size()),
            files.length,
            successfulFiles.size(),
            failedFiles.size(),
            failedFiles,
            successfulFiles
        );
    }

    public List<EvidenceUpload> getEvidenceByBatchId(String batchId) {
        return evidenceUploadRepository.findByBatchId(batchId);
    }

    public List<EvidenceUpload> getEvidenceByUser(Long userId) {
        return evidenceUploadRepository.findByUploadedByIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void approveEvidence(Long evidenceId, User approver) {
        EvidenceUpload evidence = evidenceUploadRepository.findById(evidenceId)
            .orElseThrow(() -> new IllegalArgumentException("Evidence not found"));
        
        evidence.setStatus(EvidenceUpload.ProcessingStatus.APPROVED);
        evidence.setProcessingNotes("Approved by: " + approver.getUsername());
        evidenceUploadRepository.save(evidence);
        
        log.info("Evidence {} approved by {}", evidenceId, approver.getUsername());
    }

    @Transactional
    public void rejectEvidence(Long evidenceId, String reason, User rejector) {
        EvidenceUpload evidence = evidenceUploadRepository.findById(evidenceId)
            .orElseThrow(() -> new IllegalArgumentException("Evidence not found"));
        
        evidence.setStatus(EvidenceUpload.ProcessingStatus.REJECTED);
        evidence.setProcessingNotes("Rejected by: " + rejector.getUsername() + ". Reason: " + reason);
        evidenceUploadRepository.save(evidence);
        
        log.info("Evidence {} rejected by {} - Reason: {}", evidenceId, rejector.getUsername(), reason);
    }

    private String generateUniqueFileName(String originalFileName) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String extension = "";
        int lastDot = originalFileName.lastIndexOf('.');
        if (lastDot > 0) {
            extension = originalFileName.substring(lastDot);
        }
        String baseName = originalFileName.replaceAll("[^a-zA-Z0-9.]", "_");
        if (lastDot > 0) {
            baseName = baseName.substring(0, baseName.lastIndexOf('.'));
        }
        return timestamp + "_" + baseName + extension;
    }
}