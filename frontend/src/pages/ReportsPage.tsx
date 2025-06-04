import React, { useEffect, useState } from 'react';
import { reportsApi, ReportData } from '../api/reportsApi';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import AnalyticsCharts from '../components/AnalyticsCharts';

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getAnalyticsData();
      setReportData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportType: 'owner' | 'user' | 'booking') => {
    try {
      let blob: Blob;
      switch (reportType) {
        case 'owner':
          blob = await reportsApi.getOwnerReport();
          break;
        case 'user':
          blob = await reportsApi.getUserActivityReport();
          break;
        default:
          throw new Error('Invalid report type');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!reportData) {
    return <Alert severity="info">No data available</Alert>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h5">
                {reportData.total_bookings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h5">
                ${reportData.total_revenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Price
              </Typography>
              <Typography variant="h5">
                ${reportData.average_price.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Highest Price
              </Typography>
              <Typography variant="h5">
                ${reportData.highest_price.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Charts */}
        <Grid item xs={12}>
          <AnalyticsCharts data={reportData} />
        </Grid>

        {/* Report Download Buttons */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Download Reports
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownloadReport('owner')}
                >
                  Download Owner Report
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownloadReport('user')}
                >
                  Download User Activity Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage; 