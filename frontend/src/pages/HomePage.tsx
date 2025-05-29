import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EventIcon from '@mui/icons-material/Event';
import SecurityIcon from '@mui/icons-material/Security';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <ApartmentIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Properties',
      description: 'Find and manage properties with ease. View availability and book instantly.',
    },
    {
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Booking',
      description: 'Simple booking process with instant confirmation and secure payments.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Access',
      description: 'Digital access codes for secure property entry and management.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Smart Booking
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your intelligent solution for property management and booking
        </Typography>
        <Button
          component={Link}
          to="/properties"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Explore Properties
        </Button>
      </Box>

      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Why Choose Smart Booking?
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography gutterBottom variant="h5" component="h3">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;