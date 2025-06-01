import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getData } from '../api/api';
import { Property } from '../types/api';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [roomFilter, setRoomFilter] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getData<Property[]>('/properties/available');
        setProperties(response);
        setFilteredProperties(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties. Please try again later.');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price range filter
    filtered = filtered.filter(
      (property) => property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Apply room filter
    if (roomFilter !== 'all') {
      filtered = filtered.filter((property) => property.rooms === roomFilter);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, priceRange, roomFilter, properties]);

  if (loading) return <Typography>Loading properties...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Properties
      </Typography>

      {/* Filters Section */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Properties"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">${priceRange[0]}</Typography>
              <Typography variant="body2">${priceRange[1]}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Rooms</InputLabel>
              <Select
                value={roomFilter}
                label="Rooms"
                onChange={(e) => setRoomFilter(e.target.value as number | 'all')}
              >
                <MenuItem value="all">All</MenuItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} {num === 1 ? 'Room' : 'Rooms'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Properties Grid */}
      <Grid container spacing={3}>
        {filteredProperties.map((property) => (
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
                  <Chip
                    label={`$${property.price}/night`}
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`${property.rooms} ${property.rooms === 1 ? 'Room' : 'Rooms'}`}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  {property.location && (
                    <Chip label={property.location} variant="outlined" sx={{ mb: 1 }} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredProperties.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No properties found matching your criteria
        </Typography>
      )}
    </Box>
  );
};

export default PropertiesPage;