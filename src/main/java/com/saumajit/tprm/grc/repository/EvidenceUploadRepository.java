package com.saumajit.tprm.grc.repository;

import com.saumajit.tprm.grc.model.EvidenceUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface EvidenceUploadRepository extends JpaRepository<EvidenceUpload, Long> {

    List<EvidenceUpload> findByBatchId(String batchId);

    Optional<EvidenceUpload> findByFilePath(String filePath);

    List<EvidenceUpload> findByUploadedByIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT e FROM EvidenceUpload e WHERE e.status = :status")
    List<EvidenceUpload> findByStatus(@Param("status") EvidenceUpload.ProcessingStatus status);

    @Query("SELECT COUNT(e) FROM EvidenceUpload e WHERE e.batchId = :batchId AND e.status = :status")
    Long countByBatchIdAndStatus(@Param("batchId") String batchId,
                                 @Param("status") EvidenceUpload.ProcessingStatus status);
}