package com.saumajit.tprm.grc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "third_parties")
@Data
@NoArgsConstructor

public class ThirdParty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "domain")
    private String domain;

    @Column(name = "industry")
    private String industry;

    @Column(name = "employee_count")
    private Integer employeeCount;

    @Column(name = "revenue")
    private Long revenue;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status" , nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "enrichment_data", columnDefinition = "jsonb")
    @Lob
    private String enrichmentData;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Status {
        ACTIVE, INACTIVE, UNDER_REVIEW, BLACKLISTED
    }
}
