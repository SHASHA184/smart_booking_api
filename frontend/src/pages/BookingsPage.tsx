import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { bookingApi } from '../api/bookingApi';
import { Booking, BookingStatus } from '../types/booking';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingApi.getBookings();
      setBookings(response);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      setError(null);
      await bookingApi.updateBooking(selectedBooking.id, {
        status: BookingStatus.CANCELLED,
      });
      setSuccess('Booking cancelled successfully');
      setCancelDialogOpen(false);
      fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking. Please try again later.');
      console.error('Error cancelling booking:', err);
    }
  };

  const getStatusColor = (status: BookingStatus | undefined): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'success';
      case BookingStatus.PENDING:
        return 'warning';
      case BookingStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (bookings.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Bookings
        </Typography>
        <Alert severity="info">You don't have any bookings yet.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {bookings.map((booking) => (
          <Grid item xs={12} md={6} key={booking.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {booking.property?.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {booking.property?.location}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {booking.property?.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Price: ${booking.property?.price} per night
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Typography variant="body2">
                    Check-in: {format(new Date(booking.start_date), 'PPP')}
                  </Typography>
                  <Typography variant="body2">
                    Check-out: {format(new Date(booking.end_date), 'PPP')}
                  </Typography>
                </Box>
                <Chip
                  label={booking.status || 'Unknown'}
                  color={getStatusColor(booking.status)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                {booking.access_code && (
                  <Chip
                    label={`Access Code: ${booking.access_code.code}`}
                    color="primary"
                    size="small"
                  />
                )}
              </CardContent>
              <CardActions sx={{ minHeight: 48 }}>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleCancelClick(booking)}
                  disabled={booking.status !== BookingStatus.CONFIRMED}
                  sx={{
                    visibility: booking.status === BookingStatus.CONFIRMED ? 'visible' : 'hidden'
                  }}
                >
                  Cancel Booking
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Booking</Button>
          <Button onClick={handleCancelConfirm} color="error" autoFocus>
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingsPage; 