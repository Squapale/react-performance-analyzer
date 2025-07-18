// Basic Usage Example
// This example shows how to integrate the performance analyzer library into your React app

import React from 'react';
import { 
  usePerformanceMonitoring, 
  PerformanceToggle, 
  initializePerformanceMonitoring 
} from 'performance-analyzer-lib';

// Initialize performance monitoring (do this once in your app)
initializePerformanceMonitoring({
  enabled: true,
  interval: 5000, // 5 second intervals
  thresholds: {
    slowRender: 16, // 16ms threshold
    memoryLimit: 50 * 1024 * 1024, // 50MB
  }
});

// Example component using performance monitoring
const MyComponent = () => {
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring('MyComponent');

  // Monitor data fetching
  const fetchData = async () => {
    startTiming('data-fetch');
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      
      endTiming('data-fetch');
      return data;
    } catch (error) {
      endTiming('data-fetch');
      throw error;
    }
  };

  // Monitor expensive calculations
  const processData = (data) => {
    startTiming('data-processing');
    
    const result = data.map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now()
    }));
    
    endTiming('data-processing');
    return result;
  };

  return (
    <div>
      <h2>My Component</h2>
      <button onClick={fetchData}>Fetch Data</button>
      <button onClick={() => console.log(getMetrics())}>Show Metrics</button>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <div>
      <h1>My App</h1>
      <MyComponent />
      
      {/* Add performance toggle for easy access */}
      <PerformanceToggle />
    </div>
  );
};

export default App;
