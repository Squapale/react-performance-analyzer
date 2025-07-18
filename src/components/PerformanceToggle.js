import React, { useState, useCallback } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Close as CloseIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import PerformanceDashboard from './PerformanceDashboard';

const PerformanceToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);

  const toggleDashboard = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen && window.performanceMonitor) {
      // Fetch current performance data when opening
      const data = window.performanceMonitor.getPerformanceData();
      setPerformanceData(data);
    }
  }, [isOpen]);

  const getPerformanceStatus = useCallback(() => {
    if (!window.performanceMonitor) return { status: 'unavailable', color: 'default' };
    
    const data = window.performanceMonitor.getPerformanceData();
    if (!data || !data.renderTimes.length) return { status: 'no data', color: 'default' };
    
    const avgRenderTime = data.renderTimes.reduce((sum, time) => sum + time, 0) / data.renderTimes.length;
    const currentMemory = data.memoryUsage.length > 0 ? 
      data.memoryUsage[data.memoryUsage.length - 1] / (1024 * 1024) : 0;
    
    if (avgRenderTime > 20 || currentMemory > 60) {
      return { status: 'poor', color: 'error' };
    } else if (avgRenderTime > 16 || currentMemory > 40) {
      return { status: 'fair', color: 'warning' };
    } else {
      return { status: 'good', color: 'success' };
    }
  }, []);

  const performanceStatus = getPerformanceStatus();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="performance"
        onClick={toggleDashboard}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1300,
        }}
      >
        <SpeedIcon />
      </Fab>

      {/* Performance Status Indicator */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          zIndex: 1300,
        }}
      >
        <Chip
          icon={<AssessmentIcon />}
          label={performanceStatus.status}
          color={performanceStatus.color}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Performance Dashboard Dialog */}
      <Dialog
        open={isOpen}
        onClose={toggleDashboard}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Performance Dashboard</Typography>
            <Button
              onClick={toggleDashboard}
              startIcon={<CloseIcon />}
              variant="outlined"
              size="small"
            >
              Close
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <PerformanceDashboard />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PerformanceToggle;
