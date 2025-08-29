import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Input, Button, FormControl, FormLabel, useToast, Spinner, Alert, AlertIcon, Progress, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Flex, AlertTitle, AlertDescription } from '@chakra-ui/react';

const EvidenceBatchStatus = () => {
  const [batchId, setBatchId] = useState('');
  const [batchStatus, setBatchStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchBatchStatus = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/evidence/batch/${id}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBatchStatus(data);
    } catch (e) {
      setError(e.message);
      setBatchStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (batchStatus && (batchStatus.overallStatus === 'PROCESSING' || batchStatus.overallStatus === 'PENDING')) {
      intervalId = setInterval(() => fetchBatchStatus(batchId), 5000); // Poll every 5 seconds
    } else if (intervalId) {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [batchStatus, batchId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!batchId) {
      toast({
        title: 'Batch ID required',
        description: 'Please enter a Batch ID to check its status.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    fetchBatchStatus(batchId);
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>Track Evidence Batch Upload Status</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="batchId" mb={4}>
          <FormLabel>Batch ID</FormLabel>
          <Input
            type="text"
            placeholder="Enter Batch ID (UUID)"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
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
          <AlertTitle mr={2}>Error fetching batch status!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {batchStatus && !loading && !error && (
        <Box mt={6}>
          <Heading as="h3" size="md" mb={4}>Batch Status for ID: {batchStatus.batchId}</Heading>
          <Progress value={batchStatus.progressPercentage} size="lg" colorScheme="teal" has="striped" isAnimated={batchStatus.overallStatus === 'PROCESSING'} mb={4} />
          <Text fontSize="md" mb={4}>Overall Status: <Text as="span" fontWeight="bold">{batchStatus.overallStatus}</Text></Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Total Files</StatLabel>
              <StatNumber>{batchStatus.totalFiles}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Completed Files</StatLabel>
              <StatNumber color="green.500">{batchStatus.completedFiles}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Processing Files</StatLabel>
              <StatNumber color="yellow.500">{batchStatus.processingFiles}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Pending Files</StatLabel>
              <StatNumber color="blue.500">{batchStatus.pendingFiles}</StatNumber>
            </Stat>
            <Stat p={3} shadow="sm" border="1px" borderColor="gray.200" borderRadius="md">
              <StatLabel>Failed Files</StatLabel>
              <StatNumber color="red.500">{batchStatus.failedFiles}</StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};

export default EvidenceBatchStatus;
