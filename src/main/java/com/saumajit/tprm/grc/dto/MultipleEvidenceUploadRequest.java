package com.saumajit.tprm.grc.dto;

import com.saumajit.tprm.grc.model.EvidenceUpload;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class MultipleEvidenceUploadRequest {
    
    @NotNull(message = "Evidence type is required")
    private EvidenceUpload.EvidenceType evidenceType;
    
    private List<EvidenceUpload.PolicyType> applicablePolicies;
    
    private Long questionnaireId;
    
    private Long questionId;
    
    private String description;
    
    private String tags;
    
    private Long categoryId;
}
