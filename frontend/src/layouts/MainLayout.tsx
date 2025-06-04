// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AccountCircle, Home, Business, Book, Payment, Assessment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/user';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Booking
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              color="inherit" 
              startIcon={<Home />} 
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              startIcon={<Business />} 
              onClick={() => navigate('/properties')}
            >
              Properties
            </Button>
            {isAuthenticated && (
              <>
                <Button 
                  color="inherit" 
                  startIcon={<Book />} 
                  onClick={() => navigate('/bookings')}
                >
                  My Bookings
                </Button>
                {user?.role?.toLowerCase() === 'owner' && (
                  <Button 
                    color="inherit" 
                    startIcon={<Business />} 
                    onClick={() => navigate('/my-properties')}
                  >
                    My Properties
                  </Button>
                )}
                <Button 
                  color="inherit" 
                  startIcon={<Payment />} 
                  onClick={() => navigate('/payments')}
                >
                  Payments
                </Button>
                {isAuthenticated && user?.role?.toLowerCase() === 'owner' && (
                  <Button 
                    color="inherit" 
                    startIcon={<Book />} 
                    onClick={() => navigate('/owner-bookings')}
                  >
                    Owner Bookings
                  </Button>
                )}
                {isAuthenticated && (
                  user?.role?.toLowerCase() === 'owner' ? (
                    <Button 
                      color="inherit" 
                      startIcon={<Assessment />} 
                      onClick={() => navigate('/owner-dashboard')}
                    >
                      Reports
                    </Button>
                  ) : user?.role?.toLowerCase() === 'admin' ? (
                    <Button 
                      color="inherit" 
                      startIcon={<Assessment />} 
                      onClick={() => navigate('/reports')}
                    >
                      Reports
                    </Button>
                  ) : null
                )}
              </>
            )}
            
            {isAuthenticated ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    <AccountCircle />
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  variant="outlined" 
                  onClick={() => navigate('/register')}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>
      
      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'background.paper', 
          p: 6, 
          mt: 'auto',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          © 2025 Smart Booking. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;