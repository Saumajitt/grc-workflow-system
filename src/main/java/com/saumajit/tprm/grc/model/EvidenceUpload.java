package com.saumajit.tprm.grc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evidence_uploads")
@Data
@NoArgsConstructor
public class EvidenceUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_id", nullable = false)
    private String batchId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "content_type")
    private String contentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProcessingStatus status = ProcessingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "evidence_type", nullable = false)
    private EvidenceType evidenceType;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "evidence_policy_mappings", joinColumns = @JoinColumn(name = "evidence_id"))
    @Column(name = "policy_type")
    private List<PolicyType> applicablePolicies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private EvidenceCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @Column(name = "questionnaire_id")
    private Long questionnaireId;

    @Column(name = "question_id")
    private Long questionId;

    @Column(name = "processing_notes", columnDefinition = "TEXT")
    private String processingNotes;

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProcessingStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, APPROVED, REJECTED
    }

    public enum EvidenceType {
        POLICY_DOCUMENT("Policy Document"),
        NETWORK_DIAGRAM("Network Architecture Diagram"),
        CERTIFICATE("Security Certificate"),
        AUDIT_REPORT("Audit Report"),
        PROCEDURE_DOCUMENT("Standard Operating Procedure"),
        TRAINING_RECORD("Training Record"),
        INCIDENT_REPORT("Security Incident Report"),
        RISK_ASSESSMENT("Risk Assessment Document"),
        COMPLIANCE_REPORT("Compliance Report"),
        OTHER("Other Document");

        private final String displayName;

        EvidenceType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum PolicyType {
        PASSWORD_POLICY("Password Policy"),
        ENCRYPTION_POLICY("Encryption Policy"),
        ACCESS_CONTROL_POLICY("Access Control Policy"),
        DATA_RETENTION_POLICY("Data Retention Policy"),
        BACKUP_POLICY("Backup and Recovery Policy"),
        INCIDENT_RESPONSE_POLICY("Incident Response Policy"),
        CLOUD_SECURITY_POLICY("Cloud Security Policy"),
        NETWORK_SECURITY_POLICY("Network Security Policy"),
        PRIVACY_POLICY("Privacy Policy"),
        VENDOR_MANAGEMENT_POLICY("Vendor Management Policy"),
        BUSINESS_CONTINUITY_POLICY("Business Continuity Policy"),
        CHANGE_MANAGEMENT_POLICY("Change Management Policy");

        private final String displayName;

        PolicyType(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
