package com.saumajit.tprm.grc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EvidenceBatchUploadResponse {
    
    private String batchId;
    private String status;
    private String message;
    private int totalFiles;
    private int successfulUploads;
    private int failedUploads;
    private List<String> failedFileNames;
    private List<String> successfulFileNames;
}
