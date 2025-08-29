package com.saumajit.tprm.grc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "evidence_categories")
@Data
@NoArgsConstructor

public class EvidenceCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ElementCollection
    @CollectionTable(name = "evidence_category_keywords", joinColumns = @JoinColumn(name= "category_id"))
    @Column(name = "keyword")
    private List<String> keywords;

    @Column(name = "auto_categorize")
    private Boolean autoCategorize = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
