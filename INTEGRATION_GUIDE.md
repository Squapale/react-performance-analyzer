# Performance Analyzer Library Integration Guide

## 🚀 Installation

### NPM Installation
```bash
npm install performance-analyzer-lib
```

### Yarn Installation
```bash
yarn add performance-analyzer-lib
```

## 📦 Basic Integration

### 1. Initialize in Your App

```javascript
// src/index.js or src/App.js
import { initializePerformanceMonitoring } from 'performance-analyzer-lib';

// Initialize performance monitoring
initializePerformanceMonitoring({
  enabled: process.env.NODE_ENV === 'development',
  interval: 5000, // 5 seconds
  thresholds: {
    slowRender: 16, // 16ms for 60fps
    slowLoad: 1000, // 1 second
    memoryLimit: 50 * 1024 * 1024, // 50MB
  }
});
```

### 2. Add Performance Toggle

```javascript
// src/App.js
import React from 'react';
import { PerformanceToggle } from 'performance-analyzer-lib';

function App() {
  return (
    <div className="App">
      {/* Your app content */}
      
      {/* Add performance toggle - only shows in development */}
      <PerformanceToggle />
    </div>
  );
}

export default App;
```

### 3. Monitor Components

```javascript
// src/components/MyComponent.js
import React from 'react';
import { usePerformanceMonitoring } from 'performance-analyzer-lib';

const MyComponent = () => {
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring('MyComponent');

  const handleExpensiveOperation = async () => {
    startTiming('expensive-operation');
    
    // Your expensive operation
    await someExpensiveTask();
    
    endTiming('expensive-operation');
  };

  return (
    <div>
      <button onClick={handleExpensiveOperation}>
        Run Expensive Operation
      </button>
      <button onClick={() => console.log(getMetrics())}>
        Show Metrics
      </button>
    </div>
  );
};

export default MyComponent;
```

## 🔧 Advanced Integration

### Component HOC Integration

```javascript
import React from 'react';
import { withPerformanceMonitoring } from 'performance-analyzer-lib';

const MyComponent = ({ data }) => {
  // Component logic
  return <div>{/* Component JSX */}</div>;
};

// Wrap with performance monitoring
export default withPerformanceMonitoring(MyComponent, 'MyComponent');
```

### Custom Dashboard Integration

```javascript
import React from 'react';
import { PerformanceDashboard } from 'performance-analyzer-lib';

const AdminPanel = () => {
  return (
    <div>
      <h1>Admin Panel</h1>
      
      {/* Embed performance dashboard */}
      <div style={{ marginTop: '20px' }}>
        <PerformanceDashboard />
      </div>
    </div>
  );
};

export default AdminPanel;
```

## 🧪 Testing Integration

### Automated Testing Setup

```javascript
// src/utils/performanceTesting.js
import { PerformanceTestSuite, performanceComparator } from 'performance-analyzer-lib';

export const runPerformanceTests = async () => {
  console.log('🧪 Running Performance Tests...');
  
  // Run full test suite
  const results = await PerformanceTestSuite.runFullSuite();
  
  // Export results
  PerformanceTestSuite.exportResults(results);
  
  return results;
};

export const benchmarkComponent = async (componentName, iterations = 50) => {
  return await PerformanceTestSuite.testComponentRender(componentName, iterations);
};
```

### Performance Comparison Workflow

```javascript
// src/utils/performanceComparison.js
import { performanceComparator } from 'performance-analyzer-lib';

export const setupPerformanceComparison = (componentName) => {
  // Set baseline before optimization
  const setBaseline = (metrics) => {
    performanceComparator.setBaseline(componentName, metrics);
  };
  
  // Record current performance after optimization
  const recordCurrent = (metrics) => {
    performanceComparator.recordCurrent(componentName, metrics);
  };
  
  // Compare performance
  const compare = () => {
    return performanceComparator.comparePerformance(componentName);
  };
  
  return { setBaseline, recordCurrent, compare };
};
```

## 🎯 Production Considerations

### Environment Configuration

```javascript
// src/config/performance.js
const performanceConfig = {
  development: {
    enabled: true,
    interval: 5000,
    thresholds: {
      slowRender: 16,
      slowLoad: 1000,
      memoryLimit: 50 * 1024 * 1024,
    }
  },
  production: {
    enabled: false, // Disable in production
    interval: 0,
    thresholds: {}
  }
};

export default performanceConfig[process.env.NODE_ENV] || performanceConfig.development;
```

### Conditional Loading

```javascript
// src/utils/performanceLoader.js
let performanceTools = null;

if (process.env.NODE_ENV === 'development') {
  performanceTools = require('performance-analyzer-lib');
  performanceTools.initializePerformanceMonitoring();
}

export const usePerformanceMonitoring = (componentName) => {
  if (performanceTools) {
    return performanceTools.usePerformanceMonitoring(componentName);
  }
  
  // Return no-op functions for production
  return {
    startTiming: () => {},
    endTiming: () => {},
    getMetrics: () => ({})
  };
};
```

## 📊 Console Integration

### Browser Console Commands

Add these to your browser console for quick analysis:

```javascript
// Quick performance check
performanceAnalysis.quickCheck();

// Analyze specific component
performanceAnalysis.analyzeComponent('MyComponent');

// Check for memory leaks
performanceAnalysis.checkMemoryLeaks();

// Generate full report
performanceAnalysis.generateFullReport();

// Run automated tests
performanceAnalysis.runPerformanceTests();
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Performance Tests
on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run performance tests
        run: npm run test:performance
```

### Package.json Scripts

```json
{
  "scripts": {
    "test:performance": "node scripts/performance-tests.js",
    "analyze:performance": "node scripts/performance-analysis.js",
    "benchmark": "node scripts/benchmark.js"
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Performance monitoring not initializing**
   - Ensure you're in development mode
   - Check console for initialization messages
   - Verify correct import paths

2. **Dashboard not showing**
   - Check that PerformanceToggle is added to your app
   - Ensure you're in development mode
   - Look for the floating speed icon in bottom-right

3. **No performance data**
   - Navigate through your app to generate data
   - Check that components are being monitored
   - Verify performance monitoring is enabled

### Debug Mode

```javascript
// Enable debug mode
initializePerformanceMonitoring({
  enabled: true,
  debug: true, // Enable debug logging
  interval: 5000
});
```

## 📚 API Reference

### Core Functions
- `initializePerformanceMonitoring(config)` - Initialize monitoring
- `usePerformanceMonitoring(componentName)` - React hook for monitoring
- `withPerformanceMonitoring(Component, name)` - HOC for monitoring

### Components
- `PerformanceDashboard` - Full dashboard component
- `PerformanceToggle` - Floating toggle button

### Testing
- `PerformanceTestSuite` - Testing utilities
- `performanceComparator` - Performance comparison tools

### Analysis
- `performanceAnalysis` - Console analysis tools

## 🎉 Next Steps

1. **Integrate basic monitoring** in your key components
2. **Add performance dashboard** to your admin panel
3. **Set up automated testing** in your CI/CD pipeline
4. **Create performance budgets** for your application
5. **Monitor and optimize** based on the collected data

For more detailed information, see the [Comprehensive Performance Guide](./docs/COMPREHENSIVE_PERFORMANCE_GUIDE.md).
