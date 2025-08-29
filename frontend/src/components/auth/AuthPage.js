import React, { useState } from 'react';
import { Box, Container } from '@chakra-ui/react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container maxW="container.sm" py={8}>
      <Box minH="80vh" display="flex" alignItems="center">
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </Box>
    </Container>
  );
};

export default AuthPage;
