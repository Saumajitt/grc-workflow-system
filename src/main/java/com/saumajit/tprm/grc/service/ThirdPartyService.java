package com.saumajit.tprm.grc.service;

import com.saumajit.tprm.grc.model.BulkImportJob;
import com.saumajit.tprm.grc.model.ThirdParty;
import com.saumajit.tprm.grc.repository.BulkImportJobRepository;
import com.saumajit.tprm.grc.repository.ThirdPartyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "spring.kafka.bootstrap-servers")
public class ThirdPartyService {

    private final ThirdPartyRepository thirdPartyRepository;
    private final BulkImportJobRepository bulkImportJobRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public UUID startBulkImport(MultipartFile file, Long userId) {
        try {
            UUID jobId = UUID.randomUUID();

            // Parse CSV safely with try-with-resources
            List<CSVRecord> records;
            CSVFormat csvFormat = CSVFormat.Builder.create()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build();

            try (CSVParser parser = csvFormat.parse(new InputStreamReader(file.getInputStream()))) {
                records = parser.getRecords();
            }


            // Create import job
            BulkImportJob job = new BulkImportJob();
            job.setJobId(jobId);
            job.setFileName(file.getOriginalFilename());
            job.setTotalRecords(records.size());
            job.setStartedBy(userId);
            job.setStatus(BulkImportJob.JobStatus.PROCESSING);

            bulkImportJobRepository.save(job);

            // Send for async processing
            kafkaTemplate.send("tprm-bulk-import", jobId.toString());

            log.info("Started bulk import job: {} with {} records", jobId, records.size());
            return jobId;

        } catch (Exception e) {
            log.error("Error starting bulk import: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to start bulk import", e);
        }
    }

    @KafkaListener(topics = "tprm-bulk-import")
    @Transactional
    public void processBulkImport(String jobIdString) {
        UUID jobId = UUID.fromString(jobIdString);
        BulkImportJob job = bulkImportJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        try {
            log.info("Processing bulk import job: {}", jobId);

            // In production, you'd retrieve the file from storage
            // For this example, we'll simulate processing
            processThirdPartyRecords(job);

            job.setStatus(BulkImportJob.JobStatus.COMPLETED);
            bulkImportJobRepository.save(job);

        } catch (Exception e) {
            log.error("Error processing bulk import: {}", jobId, e);
            job.setStatus(BulkImportJob.JobStatus.FAILED);
            job.setErrorDetails(e.getMessage());
            bulkImportJobRepository.save(job);
        }
    }

    private void processThirdPartyRecords(BulkImportJob job) {
        // Simulate processing records
        int totalRecords = job.getTotalRecords();
        int successCount = 0;
        int failCount = 0;

        for (int i = 0; i < totalRecords; i++) {
            try {
                // Simulate record processing
                ThirdParty thirdParty = new ThirdParty();
                thirdParty.setCompanyName("Company " + (i + 1));
                thirdParty.setDomain("company" + (i + 1) + ".com");
                thirdParty.setIndustry("Technology");
                thirdParty.setRiskScore(calculateRiskScore(thirdParty));

                // Check for duplicates
                if (thirdPartyRepository.findByCompanyNameIgnoreCase(thirdParty.getCompanyName()).isEmpty()) {
                    thirdPartyRepository.save(thirdParty);
                    successCount++;
                } else {
                    log.warn("Duplicate company found: {}", thirdParty.getCompanyName());
                    failCount++;
                }

                // Update progress
                job.setProcessedRecords(i + 1);
                job.setSuccessfulRecords(successCount);
                job.setFailedRecords(failCount);

                if ((i + 1) % 100 == 0) {
                    bulkImportJobRepository.save(job);
                    log.info("Processed {} out of {} records", i + 1, totalRecords);
                }

            } catch (Exception e) {
                failCount++;
                log.error("Error processing record {}: {}", i + 1, e.getMessage());
            }
        }

        job.setProcessedRecords(totalRecords);
        job.setSuccessfulRecords(successCount);
        job.setFailedRecords(failCount);
    }

    private Integer calculateRiskScore(ThirdParty thirdParty) {
        // Simulate risk calculation based on various factors
        return (int) (Math.random() * 100);
    }

    public BulkImportJob getImportStatus(UUID jobId) {
        return bulkImportJobRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));
    }

    public List<ThirdParty> searchThirdParties(String query) {
        return thirdPartyRepository.findByCompanyNameContaining(query);
    }
}