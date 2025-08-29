import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  useColorMode,
  IconButton,
  Spacer
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <Box bg="white" px={4} shadow="sm" borderBottom="1px" borderColor="gray.200">
      <Flex h={16} alignItems="center">
        <HStack spacing={8} alignItems="center">
          <Box fontWeight="bold" fontSize="xl" color="blue.600">
            GRC Workflow
          </Box>
          
          {isAuthenticated && (
            <HStack as="nav" spacing={4}>
              <Button as={RouterLink} to="/" variant="ghost">
                Dashboard
              </Button>
              <Button as={RouterLink} to="/evidence" variant="ghost">
                Evidence
              </Button>
              <Button as={RouterLink} to="/third-party" variant="ghost">
                Third Party
              </Button>
            </HStack>
          )}
        </HStack>

        <Spacer />

        <HStack spacing={4}>
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />

          {isAuthenticated ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
                <HStack spacing={2}>
                  <Avatar size="sm" name={user?.firstName + ' ' + user?.lastName} />
                  <Text>{user?.firstName}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Text fontSize="sm" color="gray.500">
                    {user?.email}
                  </Text>
                </MenuItem>
                <MenuDivider />
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout} color="red.500">
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as={RouterLink} to="/auth" colorScheme="blue">
              Sign In
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
