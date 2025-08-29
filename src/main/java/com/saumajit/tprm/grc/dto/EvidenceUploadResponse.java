package com.saumajit.tprm.grc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
public class EvidenceUploadResponse {
    
    private UUID batchId;
    private String status;
    private String message;
    
    public EvidenceUploadResponse(UUID batchId, String status, String message) {
        this.batchId = batchId;
        this.status = status;
        this.message = message;
    }
}