import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import apiClient from '../api/apiClient';
import { Booking } from '../types/booking';

const OwnerBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<Booking[]>('/bookings/owner');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings.');
    } finally {
      setLoading(false);
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
      <Typography variant="h4" gutterBottom>
        Bookings for My Properties
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Guest</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.property?.name}</TableCell>
                <TableCell>{booking.user_id}</TableCell>
                <TableCell>{new Date(booking.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(booking.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={
                      booking.status === 'confirmed'
                        ? 'success'
                        : booking.status === 'pending'
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={
                      booking.payment
                        ? `Payment: ${booking.payment.status.charAt(0).toUpperCase() + booking.payment.status.slice(1)}`
                        : 'Not paid'
                    }
                    color={
                      booking.payment?.status === 'success'
                        ? 'success'
                        : booking.payment?.status === 'failed'
                        ? 'error'
                        : 'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>${booking.booking_price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {bookings.length === 0 && !error && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No bookings found for your properties.
        </Typography>
      )}
    </Box>
  );
};

export default OwnerBookingsPage; 