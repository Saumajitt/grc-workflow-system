import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  CardHeader, 
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Badge,
  Button,
  Icon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AttachmentIcon, CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Welcome back, {user?.firstName}!
          </Heading>
          <Text color="gray.600" fontSize="lg">
            GRC Workflow Management System - Third Party Risk Management
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Evidence</StatLabel>
                <StatNumber>24</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green">+12%</Badge> from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Reviews</StatLabel>
                <StatNumber>8</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="orange">3 urgent</Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Third Parties</StatLabel>
                <StatNumber>156</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="blue">Active</Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Compliance Score</StatLabel>
                <StatNumber>94%</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green">Excellent</Badge>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Button 
                  as={RouterLink} 
                  to="/evidence" 
                  leftIcon={<AttachmentIcon />}
                  colorScheme="blue"
                  size="lg"
                >
                  Upload Evidence
                </Button>
                <Button 
                  as={RouterLink} 
                  to="/third-party" 
                  leftIcon={<Icon viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </Icon>}
                  colorScheme="green"
                  variant="outline"
                  size="lg"
                >
                  Manage Third Parties
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <HStack>
                  <CheckCircleIcon color="green.500" />
                  <Text fontSize="sm">Evidence uploaded for SOC 2 compliance</Text>
                </HStack>
                <HStack>
                  <WarningIcon color="orange.500" />
                  <Text fontSize="sm">Third party assessment due in 3 days</Text>
                </HStack>
                <HStack>
                  <CheckCircleIcon color="green.500" />
                  <Text fontSize="sm">ISO 27001 documentation approved</Text>
                </HStack>
                <HStack>
                  <WarningIcon color="orange.500" />
                  <Text fontSize="sm">GDPR compliance review pending</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card>
          <CardHeader>
            <Heading size="md">System Features</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <VStack>
                <AttachmentIcon boxSize={8} color="blue.500" />
                <Text fontWeight="bold">Evidence Management</Text>
                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Upload, categorize, and track compliance evidence with drag-and-drop functionality
                </Text>
              </VStack>
              <VStack>
                <Icon viewBox="0 0 20 20" fill="currentColor" boxSize={8} color="green.500">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </Icon>
                <Text fontWeight="bold">Third Party Risk</Text>
                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Assess and monitor third-party vendors for compliance and security risks
                </Text>
              </VStack>
              <VStack>
                <Icon viewBox="0 0 20 20" fill="currentColor" boxSize={8} color="purple.500">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path d="M20 13H4v-2a2 2 0 012-2h12a2 2 0 012 2v2z" />
                </Icon>
                <Text fontWeight="bold">Workflow Automation</Text>
                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Automated workflows for compliance tracking and approval processes
                </Text>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default HomePage;
