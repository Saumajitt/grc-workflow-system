package com.saumajit.tprm.grc.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkImportResponse {
    private UUID jobId;
    private String status;
    private String message;
}