package com.saumajit.tprm.grc.repository;

import com.saumajit.tprm.grc.model.EvidenceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface EvidenceCategoryRepository extends JpaRepository<EvidenceCategory, Long> {

    Optional<EvidenceCategory> findByName(String name);
}
