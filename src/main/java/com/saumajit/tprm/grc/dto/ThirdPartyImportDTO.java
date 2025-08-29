package com.saumajit.tprm.grc.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

@Data
public class ThirdPartyImportDTO {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String domain;

    private String industry;

    private Integer employeeCount;

    private Long revenue;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Contact email is required")
    private String contactEmail;

    private String contactPhone;

    private String status = "ACTIVE";
}

