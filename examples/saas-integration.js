// SaaS Integration Model

// Core library remains MIT and free
import { usePerformanceMonitoring, PerformanceDashboard } from 'performance-analyzer-lib';

// Initialize with optional SaaS integration
const config = {
  // Free local monitoring
  local: {
    enabled: true,
    storage: 'localStorage'
  },
  
  // Paid cloud features (requires subscription)
  cloud: {
    enabled: true,
    apiKey: process.env.PERFORMANCE_ANALYZER_API_KEY,
    endpoint: 'https://api.performance-analyzer.com',
    features: {
      dataSync: true,        // Sync data to cloud
      analytics: true,       // Advanced analytics
      alerts: true,          // Email/Slack alerts
      teamDashboard: true,   // Team collaboration
      reports: true          // PDF/PowerPoint reports
    }
  }
};

// Usage - works with or without cloud features
const MyComponent = () => {
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring('MyComponent', config);
  
  // This always works (free)
  startTiming('operation');
  // ... do work
  endTiming('operation');
  
  // This works if cloud subscription is active
  const cloudMetrics = getMetrics({ includeCloudAnalytics: true });
  
  return <div>My Component</div>;
};

// Dashboard shows different features based on subscription
const Dashboard = () => {
  return (
    <PerformanceDashboard 
      config={config}
      // Free users see basic dashboard
      // Paid users see advanced features
    />
  );
};
