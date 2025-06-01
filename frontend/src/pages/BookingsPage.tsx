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
  TextField,
} from '@mui/material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { bookingApi } from '../api/bookingApi';
import { Booking, BookingStatus } from '../types/booking';
import PaymentIcon from '@mui/icons-material/Payment';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

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

  const handlePayClick = (booking: Booking) => {
    setSelectedBookingForPayment(booking);
    setPaymentAmount(booking.booking_price || 0);
    setPayDialogOpen(true);
    setPaymentError(null);
    setPaymentSuccess(null);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedBookingForPayment) return;
    try {
      setPaymentError(null);
      await bookingApi.postPayment(selectedBookingForPayment.id, {
        amount: paymentAmount,
        status: 'success',
      });
      setPaymentSuccess('Payment successful!');
      setPayDialogOpen(false);
      setSelectedBookingForPayment(null);
      fetchBookings();
    } catch (err) {
      setPaymentError('Failed to process payment. Please try again.');
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
                <Typography variant="body2" gutterBottom>
                  Total Price: ${booking.booking_price}
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
                <Button
                  variant="outlined"
                  color={
                    booking.payment?.status === 'success'
                      ? 'success'
                      : booking.payment?.status === 'failed'
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                  disabled
                  sx={{ mr: 1 }}
                >
                  {booking.payment
                    ? `Payment: ${booking.payment.status.charAt(0).toUpperCase() + booking.payment.status.slice(1)}`
                    : 'Not paid'}
                </Button>
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
                {(!booking.payment || booking.payment.status !== 'success') && (
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<PaymentIcon />}
                    onClick={() => handlePayClick(booking)}
                    sx={{ ml: 1 }}
                  >
                    Pay
                  </Button>
                )}
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

      <Dialog open={payDialogOpen} onClose={() => setPayDialogOpen(false)}>
        <DialogTitle>Pay for Booking</DialogTitle>
        <DialogContent>
          {paymentError && <Alert severity="error">{paymentError}</Alert>}
          {paymentSuccess && <Alert severity="success">{paymentSuccess}</Alert>}
          <Typography gutterBottom>
            Property: {selectedBookingForPayment?.property?.name}
          </Typography>
          <Typography gutterBottom>
            Amount to Pay:
          </Typography>
          <TextField
            type="number"
            value={paymentAmount}
            onChange={e => setPaymentAmount(Number(e.target.value))}
            fullWidth
            inputProps={{ min: 0, step: 0.01 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePaymentSubmit} variant="contained" color="primary">
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingsPage; 