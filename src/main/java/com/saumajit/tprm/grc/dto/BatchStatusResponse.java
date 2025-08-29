package com.saumajit.tprm.grc.dto;

import lombok.Data;
import lombok.Builder;

import java.util.UUID;

@Data
@Builder
public class BatchStatusResponse {
    private UUID batchId;
    private Integer totalFiles;
    private Integer pendingFiles;
    private Integer processingFiles;
    private Integer completedFiles;
    private Integer failedFiles;
    private String overallStatus;
    private Integer progressPercentage;
}