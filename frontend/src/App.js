import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ColorModeScript } from '@chakra-ui/react';
import theme from './theme';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import HomePage from './pages/HomePage';
import EvidencePage from './pages/EvidencePage';
import ThirdPartyPage from './pages/ThirdPartyPage';
import HealthPage from './pages/HealthPage';

// Import components
import Navbar from './components/layout/Navbar';
import AuthPage from './components/auth/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <Router>
          <Box minH="100vh">
            <Navbar />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/evidence" element={
                <ProtectedRoute>
                  <EvidencePage />
                </ProtectedRoute>
              } />
              <Route path="/third-party" element={
                <ProtectedRoute>
                  <ThirdPartyPage />
                </ProtectedRoute>
              } />
              <Route path="/health" element={<HealthPage />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
