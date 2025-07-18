import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  BugReport as BugReportIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Fetch performance data
  const fetchPerformanceData = useCallback(() => {
    if (window.performanceMonitor) {
      const data = window.performanceMonitor.getPerformanceData();
      setPerformanceData(data);
    }
  }, []);

  // Auto-refresh performance data
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(fetchPerformanceData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, refreshInterval, fetchPerformanceData]);

  // Initial data fetch
  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev);
    if (window.performanceMonitor) {
      if (isMonitoring) {
        window.performanceMonitor.stopMonitoring();
      } else {
        window.performanceMonitor.startMonitoring();
      }
    }
  }, [isMonitoring]);

  // Generate performance report
  const generateReport = useCallback(() => {
    if (window.getPerformanceReport) {
      const report = window.getPerformanceReport();
      console.log('Performance Report:', report);
      
      // Create downloadable report
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  // Clear performance data
  const clearData = useCallback(() => {
    if (window.performanceMonitor) {
      window.performanceMonitor.clearData();
      fetchPerformanceData();
    }
  }, [fetchPerformanceData]);

  // Performance metrics summary
  const performanceMetrics = useMemo(() => {
    if (!performanceData) return null;

    const { renderTimes, memoryUsage, componentMetrics, bundleAnalysis } = performanceData;

    return {
      avgRenderTime: renderTimes.length > 0 ? 
        (renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length).toFixed(2) : 0,
      maxRenderTime: renderTimes.length > 0 ? Math.max(...renderTimes).toFixed(2) : 0,
      currentMemory: memoryUsage.length > 0 ? 
        (memoryUsage[memoryUsage.length - 1] / (1024 * 1024)).toFixed(2) : 0,
      maxMemory: memoryUsage.length > 0 ? 
        (Math.max(...memoryUsage) / (1024 * 1024)).toFixed(2) : 0,
      totalComponents: Object.keys(componentMetrics).length,
      slowComponents: Object.values(componentMetrics).filter(metric => metric.averageRenderTime > 16).length,
      bundleSize: bundleAnalysis?.totalSize ? (bundleAnalysis.totalSize / (1024 * 1024)).toFixed(2) : 'N/A',
    };
  }, [performanceData]);

  // Simple data visualization with progress bars
  const renderSimpleChart = (data, title, color = 'primary') => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const avg = data.reduce((sum, val) => sum + val, 0) / data.length;

    return (
      <Card sx={{ mb: 2 }}>
        <CardHeader title={title} />
        <CardContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Average: {avg.toFixed(2)}, Max: {max.toFixed(2)}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(avg / max) * 100}
              color={color}
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="caption" color="textSecondary">
            Last 10 measurements: {data.slice(-10).map(d => d.toFixed(1)).join(', ')}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  if (!performanceData) {
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Performance Dashboard
        </Typography>
        <Alert severity="info">
          <AlertTitle>Performance Monitoring Not Available</AlertTitle>
          Performance monitoring is only available in development mode. Make sure the performance monitoring system is initialized.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Performance Dashboard
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch checked={isMonitoring} onChange={toggleMonitoring} />}
            label="Live Monitoring"
          />
          <Button variant="contained" onClick={generateReport} sx={{ ml: 2 }}>
            Generate Report
          </Button>
          <Button variant="outlined" onClick={clearData} sx={{ ml: 1 }}>
            Clear Data
          </Button>
        </Box>
      </Box>

      {/* Performance Metrics Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SpeedIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Render Time</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {performanceMetrics.avgRenderTime}ms
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Max: {performanceMetrics.maxRenderTime}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MemoryIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Memory Usage</Typography>
              </Box>
              <Typography variant="h4" color="secondary">
                {performanceMetrics.currentMemory}MB
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Max: {performanceMetrics.maxMemory}MB
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssessmentIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Components</Typography>
              </Box>
              <Typography variant="h4" color="success">
                {performanceMetrics.totalComponents}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {performanceMetrics.slowComponents} slow components
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TimelineIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Bundle Size</Typography>
              </Box>
              <Typography variant="h4" color="info">
                {performanceMetrics.bundleSize}MB
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gzipped estimate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Trends with Simple Progress Bars */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          {renderSimpleChart(performanceData.renderTimes, 'Render Time Trend', 'primary')}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSimpleChart(
            performanceData.memoryUsage.map(usage => usage / (1024 * 1024)), 
            'Memory Usage Trend', 
            'secondary'
          )}
        </Grid>
      </Grid>

      {/* Component Performance Analysis */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Component Performance Analysis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell align="right">Render Count</TableCell>
                  <TableCell align="right">Avg Render Time (ms)</TableCell>
                  <TableCell align="right">Max Render Time (ms)</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(performanceData.componentMetrics).map(([componentName, metrics]) => (
                  <TableRow key={componentName}>
                    <TableCell component="th" scope="row">
                      {componentName}
                    </TableCell>
                    <TableCell align="right">{metrics.renderCount}</TableCell>
                    <TableCell align="right">{metrics.averageRenderTime.toFixed(2)}</TableCell>
                    <TableCell align="right">{metrics.maxRenderTime.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        size="small"
                        label={metrics.averageRenderTime > 16 ? 'Slow' : 'Good'}
                        color={metrics.averageRenderTime > 16 ? 'error' : 'success'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      {/* Performance Recommendations */}
      <Box mt={3}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Performance Recommendations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              {performanceMetrics.slowComponents > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <AlertTitle>Slow Components Detected</AlertTitle>
                  {performanceMetrics.slowComponents} components have average render times above 16ms. 
                  Consider adding memoization or optimizing these components.
                </Alert>
              )}
              
              {parseFloat(performanceMetrics.currentMemory) > 50 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  <AlertTitle>High Memory Usage</AlertTitle>
                  Current memory usage is {performanceMetrics.currentMemory}MB. 
                  Consider implementing memory optimization techniques.
                </Alert>
              )}
              
              {parseFloat(performanceMetrics.avgRenderTime) > 16 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Render Performance</AlertTitle>
                  Average render time is above 16ms. Consider using React.memo, useMemo, or useCallback 
                  for better performance.
                </Alert>
              )}
              
              <Alert severity="success">
                <AlertTitle>Performance Tips</AlertTitle>
                Use the browser console commands for detailed analysis:
                <br />• <code>performanceAnalysis.quickCheck()</code> - Quick overview
                <br />• <code>performanceAnalysis.generateFullReport()</code> - Comprehensive report
                <br />• <code>performanceAnalysis.checkMemoryLeaks()</code> - Memory analysis
              </Alert>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default PerformanceDashboard;
