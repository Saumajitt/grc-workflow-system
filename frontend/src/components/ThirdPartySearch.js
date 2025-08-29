import React, { useState } from 'react';
import { Box, Heading, Input, Button, FormControl, FormLabel, useToast, Spinner, Alert, AlertIcon, VStack, Table, Thead, Tbody, Tr, Th, Td, Tag, TagLabel, TagLeftIcon, AlertTitle, AlertDescription, Text } from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const ThirdPartySearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: 'Search query required',
        description: 'Please enter a search term.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tprm/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (e) {
      setError(e.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'UNDER_REVIEW':
        return 'yellow';
      case 'BLACKLISTED':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>Search Third-Parties</Heading>
      <form onSubmit={handleSearch}>
        <FormControl id="searchQuery" mb={4}>
          <FormLabel>Search by Company Name or Industry</FormLabel>
          <Input
            type="text"
            placeholder="Enter search query"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </FormControl>
        <Button type="submit" isLoading={loading} leftIcon={<FaSearch />} colorScheme="blue">
          Search
        </Button>
      </form>

      {loading && (
        <VStack mt={4}>
          <Spinner size="lg" />
          <Text>Searching...</Text>
        </VStack>
      )}

      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error searching third parties!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && searchResults.length > 0 && (
        <Box mt={6} overflowX="auto">
          <Text mb={4}>{searchResults.length} results found.</Text>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Company Name</Th>
                <Th>Domain</Th>
                <Th>Industry</Th>
                <Th>Employee Count</Th>
                <Th>Revenue</Th>
                <Th>Risk Score</Th>
                <Th>Status</Th>
                <Th>Contact Email</Th>
                <Th>Contact Phone</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchResults.map((thirdParty) => (
                <Tr key={thirdParty.id}>
                  <Td>{thirdParty.companyName}</Td>
                  <Td>{thirdParty.domain}</Td>
                  <Td>{thirdParty.industry}</Td>
                  <Td>{thirdParty.employeeCount}</Td>
                  <Td>{thirdParty.revenue}</Td>
                  <Td>{thirdParty.riskScore}</Td>
                  <Td>
                    <Tag size="md" colorScheme={getStatusColor(thirdParty.status)} borderRadius="full">
                      <TagLabel>{thirdParty.status}</TagLabel>
                    </Tag>
                  </Td>
                  <Td>{thirdParty.contactEmail}</Td>
                  <Td>{thirdParty.contactPhone}</Td>
                  <Td>{new Date(thirdParty.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {!loading && !error && searchResults.length === 0 && searchQuery.trim() && (
        <Alert status="info" mt={4}>
          <AlertIcon />
          No third parties found matching your query.
        </Alert>
      )}
    </Box>
  );
};

export default ThirdPartySearch;
