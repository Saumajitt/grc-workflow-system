package com.saumajit.tprm.grc.repository;

import com.saumajit.tprm.grc.model.ThirdParty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThirdPartyRepository extends JpaRepository<ThirdParty, Long> {

    Optional<ThirdParty> findByCompanyNameIgnoreCase(String companyName);

    Optional<ThirdParty> findByDomain(String domain);

    @Query("SELECT t FROM ThirdParty t WHERE LOWER(t.companyName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ThirdParty> findByCompanyNameContaining(@Param("name") String name);

    @Query("SELECT COUNT(t) FROM ThirdParty t WHERE t.status = 'ACTIVE'")
    Long countActiveThirdParties();
}
