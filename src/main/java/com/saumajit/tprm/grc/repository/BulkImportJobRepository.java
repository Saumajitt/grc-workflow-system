package com.saumajit.tprm.grc.repository;

import com.saumajit.tprm.grc.model.BulkImportJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BulkImportJobRepository extends JpaRepository<BulkImportJob, Long> {

    Optional<BulkImportJob> findByJobId(UUID jobId);
}