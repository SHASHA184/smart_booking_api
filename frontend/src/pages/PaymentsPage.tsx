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
} from '@mui/material';
import apiClient from '../api/apiClient';

interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  status: string;
  created_at: string;
}

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      // You may need to implement a /payments endpoint that returns all payments for the user
      const response = await apiClient.get<Payment[]>('/payments');
      setPayments(response.data);
    } catch (err) {
      setError('Failed to fetch payments.');
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
        My Payments
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Booking ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.booking_id}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>{new Date(payment.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {payments.length === 0 && !error && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          You have no payments yet.
        </Typography>
      )}
    </Box>
  );
};

export default PaymentsPage; 