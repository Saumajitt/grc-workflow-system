import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Button, Flex } from '@chakra-ui/react';

const HealthPage = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealthStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h1" size="xl">Health Check</Heading>
        <Button onClick={fetchHealthStatus} isLoading={loading} colorScheme="teal">Refresh</Button>
      </Flex>

      {loading && (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      )}

      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {healthData && !loading && !error && (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Application Status</StatLabel>
            <StatNumber color={healthData.application === 'UP' ? 'green.500' : 'red.500'}>
              {healthData.application || 'N/A'}
            </StatNumber>
            <StatHelpText>
              {healthData.application === 'UP' ? <StatArrow type="increase" /> : <StatArrow type="decrease" />}
              Last updated: {new Date(parseInt(healthData.timestamp)).toLocaleTimeString()}
            </StatHelpText>
          </Stat>

          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Database Status</StatLabel>
            <StatNumber color={healthData.database === 'UP' ? 'green.500' : 'red.500'}>
              {healthData.database || 'N/A'}
            </StatNumber>
            <StatHelpText>
              {healthData.database === 'UP' ? <StatArrow type="increase" /> : <StatArrow type="decrease" />}
              Last updated: {new Date(parseInt(healthData.timestamp)).toLocaleTimeString()}
            </StatHelpText>
          </Stat>

          <Stat p={5} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
            <StatLabel>Redis Status</StatLabel>
            <StatNumber color={healthData.redis === 'UP' ? 'green.500' : 'red.500'}>
              {healthData.redis || 'N/A'}
            </StatNumber>
            <StatHelpText>
              {healthData.redis === 'UP' ? <StatArrow type="increase" /> : <StatArrow type="decrease" />}
              Last updated: {new Date(parseInt(healthData.timestamp)).toLocaleTimeString()}
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      )}
    </Box>
  );
};

export default HealthPage;
