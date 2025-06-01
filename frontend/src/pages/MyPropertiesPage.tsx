import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Property } from '../types/api';
import apiClient from '../api/apiClient';

const MyPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    description: '',
    rooms: 1,
    price: 0,
    location: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<Property[]>('/properties/my-properties');
      setProperties(response.data);
    } catch (err) {
      setError('Failed to fetch properties. Please try again later.');
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async () => {
    try {
      setError(null);
      await apiClient.post<Property>('/properties', newProperty);
      setSuccess('Property created successfully!');
      setCreateDialogOpen(false);
      setNewProperty({
        name: '',
        description: '',
        rooms: 1,
        price: 0,
        location: '',
      });
      fetchProperties();
    } catch (err) {
      setError('Failed to create property. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Properties
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Add New Property
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} md={6} lg={4} key={property.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {property.name}
                </Typography>
                {property.description && (
                  <Typography color="text.secondary" paragraph>
                    {property.description}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Price: ${property.price}/night
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Rooms: {property.rooms}
                  </Typography>
                  {property.location && (
                    <Typography variant="body2" gutterBottom>
                      Location: {property.location}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {properties.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You don't have any properties yet. Add your first property!
        </Typography>
      )}

      {/* Create Property Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)}>
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Property Name"
              value={newProperty.name}
              onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={newProperty.description}
              onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Number of Rooms"
              type="number"
              value={newProperty.rooms}
              onChange={(e) => setNewProperty({ ...newProperty, rooms: parseInt(e.target.value) })}
              fullWidth
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Price per Night"
              type="number"
              value={newProperty.price}
              onChange={(e) => setNewProperty({ ...newProperty, price: parseFloat(e.target.value) })}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Location"
              value={newProperty.location}
              onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProperty} variant="contained" color="primary">
            Create Property
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPropertiesPage; 