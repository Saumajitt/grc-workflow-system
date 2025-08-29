import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Heading,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.usernameOrEmail, formData.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <Card maxW="md" mx="auto">
      <CardBody>
        <VStack spacing={6}>
          <Heading size="lg" textAlign="center">Sign In</Heading>
          
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit} w="100%">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username or Email</FormLabel>
                <Input
                  name="usernameOrEmail"
                  type="text"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  placeholder="Enter your username or email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={loading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </Box>

          <Text textAlign="center">
            Don't have an account?{' '}
            <Button variant="link" colorScheme="blue" onClick={onSwitchToRegister}>
              Sign up here
            </Button>
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default LoginForm;
