import React from 'react';
import { Box, Heading, VStack, Divider } from '@chakra-ui/react';
import EnhancedEvidenceUpload from '../components/evidence/EnhancedEvidenceUpload';
import EvidenceBatchStatus from '../components/EvidenceBatchStatus';

const EvidencePage = () => {
  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">Evidence Management</Heading>

      <VStack spacing={8} align="stretch">
        {/* Enhanced Evidence Upload */}
        <EnhancedEvidenceUpload />
        
        <Divider />
        
        {/* Batch Status Tracking */}
        <EvidenceBatchStatus />
      </VStack>
    </Box>
  );
};

export default EvidencePage;
