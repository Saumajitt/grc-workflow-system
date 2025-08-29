import React, { useState } from 'react';
import { Box, Heading, Text, VStack, Input, Button, FormControl, FormLabel, useToast, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import ThirdPartyImportStatus from '../components/ThirdPartyImportStatus';
import ThirdPartySearch from '../components/ThirdPartySearch';

const ThirdPartyPage = () => {
  const [importFile, setImportFile] = useState(null);
  const [validateFile, setValidateFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [validateLoading, setValidateLoading] = useState(false);
  const toast = useToast();

  const handleImportFileChange = (event) => {
    setImportFile(event.target.files[0]);
  };

  const handleValidateFileChange = (event) => {
    setValidateFile(event.target.files[0]);
  };

  const handleBulkImport = async () => {
    if (!importFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file for bulk import.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setImportLoading(true);
    const formData = new FormData();
    formData.append('file', importFile);
    formData.append('userId', '1'); // Assuming a default userId

    try {
      const response = await fetch('/api/tprm/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to start bulk import');
      }

      toast({
        title: 'Bulk import initiated',
        description: `Job ID: ${result.jobId}. Status: ${result.status}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setImportFile(null);
    } catch (error) {
      toast({
        title: 'Bulk import failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setImportLoading(false);
    }
  };

  const handleValidateData = async () => {
    if (!validateFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to validate.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setValidateLoading(true);
    const formData = new FormData();
    formData.append('file', validateFile);

    try {
      const response = await fetch('/api/tprm/validate', {
        method: 'POST',
        body: formData,
      });

      const result = await response.text();

      if (!response.ok) {
        // Assuming validation errors might come as a non-200 status with a message
        throw new Error(result || 'File validation failed');
      }

      toast({
        title: 'File Validation Successful',
        description: result,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setValidateFile(null);
    } catch (error) {
      toast({
        title: 'File Validation Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setValidateLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6}>Third-Party Management</Heading>

      <VStack spacing={8} align="stretch">
        {/* Bulk Import Section */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>Bulk Import Third-Party Data</Heading>
          <Text mb={4}>Upload a CSV file to bulk import third-party records. Ensure the CSV format matches the expected structure (e.g., companyName, domain, industry, employeeCount, revenue, contactEmail, contactPhone, status).</Text>
          <FormControl mb={4}>
            <FormLabel>Select CSV File for Import</FormLabel>
            <Input type="file" accept=".csv" onChange={handleImportFileChange} />
          </FormControl>
          <Button onClick={handleBulkImport} isLoading={importLoading} colorScheme="purple">
            Start Bulk Import
          </Button>
          {importFile && <Text mt={2}>Selected for import: {importFile.name}</Text>}
        </Box>

        {/* Data Validation Section */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>Validate Third-Party Import Data</Heading>
          <Text mb={4}>Upload a CSV file to validate its structure and content before a full import.</Text>
          <FormControl mb={4}>
            <FormLabel>Select CSV File for Validation</FormLabel>
            <Input type="file" accept=".csv" onChange={handleValidateFileChange} />
          </FormControl>
          <Button onClick={handleValidateData} isLoading={validateLoading} colorScheme="teal">
            Validate File
          </Button>
          {validateFile && <Text mt={2}>Selected for validation: {validateFile.name}</Text>}
        </Box>

        {/* Future: Import Status Tracking Component */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>Third-Party Import Status</Heading>
          <Text mb={4}>This section will allow you to track the status of bulk import jobs.</Text>
          <ThirdPartyImportStatus />
        </Box>

        {/* Future: Third-Party Search Component */}
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
          <Heading as="h2" size="lg" mb={4}>Search Third-Parties</Heading>
          <Text mb={4}>This section will provide search functionality for existing third-party records.</Text>
          <ThirdPartySearch />
        </Box>
      </VStack>
    </Box>
  );
};

export default ThirdPartyPage;
