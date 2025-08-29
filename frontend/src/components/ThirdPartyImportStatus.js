import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Input, Button, FormControl, FormLabel, useToast, Spinner, Alert, AlertIcon, Progress, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, Tag, TagLabel, TagLeftIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const getStatusColor = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'PROCESSING':
      return 'yellow';
    case 'PENDING':
      return 'blue';
    case 'FAILED':
    case 'CANCELLED':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'COMPLETED':
      return <FaCheckCircle />;
    case 'PROCESSING':
      return <FaHourglassHalf />;
    case 'PENDING':
      return <FaHourglassHalf />;
    case 'FAILED':
    case 'CANCELLED':
      return <FaTimesCircle />;
    default:
      return <FaExclamationTriangle />;
  }
};

const ThirdPartyImportStatus = () => {
  const [jobId, setJobId] = useState('');
  const [importJob, setImportJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchImportStatus = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tprm/import-status/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImportJob(data);
    } catch (e) {
      setError(e.message);
      setImportJob(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (importJob && (importJob.status === 'PROCESSING' || importJob.status === 'PENDING')) {
      intervalId = setInterval(() => fetchImportStatus(jobId), 5000); // Poll every 5 seconds
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [importJob, jobId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!jobId) {
      toast({
        title: 'Job ID required',
        description: 'Please enter a Job ID to check its status.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    fetchImportStatus(jobId);
  };

  const progressPercentage = importJob ? (importJob.processedRecords * 100 / importJob.totalRecords) : 0;

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>Track Third-Party Import Status</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="jobId" mb={4}>
          <FormLabel>Job ID</FormLabel>
          <Input
            type="text"
            placeholder="Enter Job ID (UUID)"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          />
        </FormControl>
        <Button type="submit" isLoading={loading} colorScheme="blue">
          Check Status
        </Button>
      </form>

      {loading && (
        <Flex justify="center" align="center" mt={4}>
          <Spinner size="lg" />
        </Flex>
      )}

      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error fetching import status!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {importJob && !loading && !error && (
        <Box mt={6}>
          <Heading as="h3" size="md" mb={4}>Import Job Status for ID: {importJob.jobId}</Heading>
          <Progress value={progressPercentage} size="lg" colorScheme="teal" has="striped" isAnimated={importJob.status === 'PROCESSING'} mb={4} />
          <Text fontSize="md" mb={4}>
            Overall Status: <Tag size="lg" colorScheme={getStatusColor(importJob.status)} borderRadius="full">
              <TagLeftIcon as={getStatusIcon(importJob.status)} />
              <TagLabel>{importJob.status}</TagLabel>
            </Tag>
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>File Name</StatLabel>
              <StatNumber>{importJob.fileName}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Total Records</StatLabel>
              <StatNumber>{importJob.totalRecords}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Processed Records</StatLabel>
              <StatNumber color="blue.500">{importJob.processedRecords}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Successful Records</StatLabel>
              <StatNumber color="green.500">{importJob.successfulRecords}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Failed Records</StatLabel>
              <StatNumber color="red.500">{importJob.failedRecords}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Started By</StatLabel>
              <StatNumber>{importJob.startedBy}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Created At</StatLabel>
              <StatNumber>{new Date(importJob.createdAt).toLocaleString()}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Last Updated</StatLabel>
              <StatNumber>{new Date(importJob.updatedAt).toLocaleString()}</StatNumber>
            </Stat>
          </SimpleGrid>

          {importJob.errorDetails && (
            <Alert status="warning" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>Error Details:</AlertTitle>
              <AlertDescription>{importJob.errorDetails}</AlertDescription>
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ThirdPartyImportStatus;
