import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Spinner, Center } from '@chakra-ui/react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" />
        </Box>
      </Center>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
