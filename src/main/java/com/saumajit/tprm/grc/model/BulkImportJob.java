package com.saumajit.tprm.grc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bulk_import_jobs")
@Data
@NoArgsConstructor

public class BulkImportJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", unique = true, nullable = false, updatable = false)
    private UUID jobId = UUID.randomUUID();

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "total_records")
    private Integer totalRecords;

    @Column(name = "processed_records")
    private Integer processedRecords = 0;

    @Column(name = "successful_records")
    private Integer successfulRecords = 0;

    @Column(name = "failed_records")
    private Integer failedRecords = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private JobStatus status = JobStatus.PENDING;

    @Column(name = "error_details", columnDefinition = "text")
    private String errorDetails;

    @Column(name = "started_by")
    private Long startedBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum JobStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}
