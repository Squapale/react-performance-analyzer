# Complete Performance Analysis Tool Guide

## 🎯 Overview

This guide provides comprehensive instructions for using the performance analysis tools integrated into your React application. The system includes real-time monitoring, detailed component analysis, memory tracking, and automated testing capabilities.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [React Hooks & Components](#react-hooks--components)
3. [Higher Order Components (HOC)](#higher-order-components-hoc)
4. [Performance Logger](#performance-logger)
5. [Performance Dashboard](#performance-dashboard)
6. [Browser Console Tools](#browser-console-tools)
7. [Component Performance Analysis](#component-performance-analysis)
8. [Memory Analysis](#memory-analysis)
9. [Performance Comparison](#performance-comparison)
10. [Automated Testing](#automated-testing)
11. [Real-World Usage Examples](#real-world-usage-examples)
12. [Troubleshooting](#troubleshooting)
13. [Advanced Features](#advanced-features)

---

## 🚀 Getting Started

### Prerequisites
- Application running in **development mode** (`npm start`)
- Browser developer tools available (Chrome/Firefox recommended)
- Performance monitoring automatically initializes on startup

### Quick Setup Verification
1. Start your development server
2. Open browser developer tools (F12)
3. Check console for initialization message:
   ```
   🚀 Performance monitoring initialized!
   📊 Available tools: {...}
   ```

### First Steps
1. **Visual Dashboard**: Look for the floating speed icon (⚡) in bottom-right corner
2. **Console Access**: Open browser console and try `performanceAnalysis.quickCheck()`
3. **Component Monitoring**: Navigate through your app to generate performance data

---

## ⚛️ React Hooks & Components

### Performance Monitoring Hook

The `usePerformanceMonitoring` hook provides component-level performance tracking with timing utilities.

#### Basic Usage

```javascript
import { usePerformanceMonitoring } from 'performance-analyzer-lib';

function MyComponent() {
  const { startTiming, endTiming, getMetrics, metrics } = usePerformanceMonitoring('MyComponent');

  const handleDataFetch = async () => {
    startTiming('data-fetch');
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      return data;
    } finally {
      const duration = endTiming('data-fetch');
      console.log(`Data fetch took ${duration}ms`);
    }
  };

  const handleComplexCalculation = () => {
    startTiming('calculation');
    
    // Expensive calculation
    const result = heavyComputation();
    
    endTiming('calculation');
    return result;
  };

  // View current metrics
  console.log('Component metrics:', metrics);

  return (
    <div>
      <button onClick={handleDataFetch}>Fetch Data</button>
      <button onClick={handleComplexCalculation}>Calculate</button>
      <pre>{JSON.stringify(getMetrics(), null, 2)}</pre>
    </div>
  );
}
```

#### Advanced Hook Usage

```javascript
function OptimizedComponent() {
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring('OptimizedComponent');

  // Monitor effect performance
  useEffect(() => {
    startTiming('effect-setup');
    
    // Setup expensive operations
    const subscription = subscribeToData();
    
    endTiming('effect-setup');

    return () => {
      startTiming('effect-cleanup');
      subscription.unsubscribe();
      endTiming('effect-cleanup');
    };
  }, []);

  // Monitor render performance
  useLayoutEffect(() => {
    startTiming('layout-effect');
    
    // DOM measurements
    const element = ref.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      updateLayout(rect);
    }
    
    endTiming('layout-effect');
  });

  return <div ref={ref}>Content</div>;
}
```

### Simple Performance Hook

The `usePerformanceMonitor` hook provides basic component lifecycle monitoring.

```javascript
import { usePerformanceMonitor } from 'performance-analyzer-lib';

function BasicComponent() {
  // Automatically tracks component mount/unmount time
  usePerformanceMonitor('BasicComponent');

  return <div>This component is automatically monitored</div>;
}
```

---

## 🔄 Higher Order Components (HOC)

### Performance Monitoring HOC

The `withPerformanceMonitoring` HOC wraps components to automatically track render performance.

#### Basic HOC Usage

```javascript
import { withPerformanceMonitoring } from 'performance-analyzer-lib';

// Original component
const ExpensiveComponent = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: heavyCalculation(item)
    }));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.processed}</div>
      ))}
    </div>
  );
};

// Wrap with performance monitoring
const MonitoredExpensiveComponent = withPerformanceMonitoring(
  ExpensiveComponent, 
  'ExpensiveComponent'
);

// Use the monitored component
function App() {
  return (
    <div>
      <MonitoredExpensiveComponent data={largeDataset} />
    </div>
  );
}
```

#### HOC with Class Components

```javascript
import React, { Component } from 'react';
import { withPerformanceMonitoring } from 'performance-analyzer-lib';

class LegacyComponent extends Component {
  componentDidMount() {
    // Expensive setup
    this.setupExpensiveOperation();
  }

  render() {
    return (
      <div>
        <h1>Legacy Component</h1>
        {this.props.items.map(item => (
          <div key={item.id}>{item.value}</div>
        ))}
      </div>
    );
  }
}

// Monitor the class component
const MonitoredLegacyComponent = withPerformanceMonitoring(
  LegacyComponent,
  'LegacyComponent'
);

export default MonitoredLegacyComponent;
```

#### HOC Best Practices

```javascript
// ✅ Good: Use descriptive component names
const MonitoredComponent = withPerformanceMonitoring(MyComponent, 'UserDashboard');

// ✅ Good: Monitor key components that impact performance
const CriticalComponents = [
  withPerformanceMonitoring(DataTable, 'DataTable'),
  withPerformanceMonitoring(ChartComponent, 'ChartComponent'),
  withPerformanceMonitoring(FilterPanel, 'FilterPanel')
];

// ✅ Good: Use in development, consider removing in production
const ComponentToMonitor = process.env.NODE_ENV === 'development' 
  ? withPerformanceMonitoring(Component, 'ComponentName')
  : Component;

// ❌ Avoid: Wrapping every single component
// Only monitor components where performance matters
```

---

## 📝 Performance Logger

### Logger Overview

The `performanceLogger` provides structured logging for performance-related information with categorized output.

#### Basic Logger Usage

```javascript
import { performanceLogger } from 'performance-analyzer-lib';

function MyComponent() {
  useEffect(() => {
    performanceLogger.info('Component mounted', { component: 'MyComponent' });
    
    const startTime = performance.now();
    
    fetchData()
      .then(data => {
        const endTime = performance.now();
        performanceLogger.timing('Data fetch', startTime, endTime);
        performanceLogger.info('Data loaded successfully', { 
          recordCount: data.length,
          duration: endTime - startTime 
        });
      })
      .catch(error => {
        performanceLogger.error('Data fetch failed', { 
          error: error.message,
          component: 'MyComponent'
        });
      });

    return () => {
      performanceLogger.info('Component unmounting', { component: 'MyComponent' });
    };
  }, []);
}
```

#### Logger Methods

```javascript
// Information logging
performanceLogger.info('Operation completed', { operation: 'dataProcessing' });

// Warning logging
performanceLogger.warn('Slow operation detected', { 
  operation: 'rendering',
  duration: 25,
  threshold: 16 
});

// Error logging
performanceLogger.error('Performance threshold exceeded', { 
  component: 'DataTable',
  renderTime: 45,
  limit: 16 
});

// Timing operations
const startTime = performance.now();
// ... operation ...
performanceLogger.timing('Heavy calculation', startTime);

// Memory usage
performanceLogger.memory(); // Shows current memory usage

// Tabular data
const performanceData = {
  component1: { renderTime: 12, memory: 1024 },
  component2: { renderTime: 8, memory: 512 },
  component3: { renderTime: 22, memory: 2048 }
};
performanceLogger.table(performanceData, 'Component Performance');
```

#### Advanced Logger Usage

```javascript
// Create a performance-aware async function
async function performanceAwareOperation(operationName, asyncFn, ...args) {
  performanceLogger.info(`Starting ${operationName}`);
  const startTime = performance.now();
  
  try {
    const result = await asyncFn(...args);
    const duration = performanceLogger.timing(operationName, startTime);
    
    if (duration > 1000) {
      performanceLogger.warn(`Slow operation: ${operationName}`, { duration });
    } else {
      performanceLogger.info(`Operation completed: ${operationName}`, { duration });
    }
    
    return result;
  } catch (error) {
    performanceLogger.error(`Operation failed: ${operationName}`, { 
      error: error.message,
      duration: performance.now() - startTime 
    });
    throw error;
  }
}

// Usage
const data = await performanceAwareOperation(
  'fetchUserData',
  fetch,
  '/api/users'
);
```

---

## 📊 Performance Dashboard

### Accessing the Dashboard
- **Location**: Floating speed icon (⚡) in bottom-right corner
- **Visibility**: Development mode only
- **Opens**: Click the icon to open the performance dashboard

### Dashboard Features

#### 1. **Overview Cards**
Display key performance metrics:
- **Average Render Time**: Target < 16ms for 60fps
- **Memory Usage**: Current and maximum memory consumption
- **Components**: Total monitored components and slow component count
- **Bundle Size**: Estimated bundle size

#### 2. **Performance Trends**
- **Render Time Trend**: Progress bar showing recent render performance
- **Memory Usage Trend**: Memory consumption over time
- **Simple Visualizations**: Easy-to-read progress bars and metrics

#### 3. **Component Analysis Table**
Detailed breakdown of each component:
- **Component Name**: Name of the monitored component
- **Render Count**: Number of times component has rendered
- **Average Render Time**: Mean render time in milliseconds
- **Max Render Time**: Longest render time recorded
- **Status**: Color-coded performance status (Good/Slow)

#### 4. **Performance Recommendations**
Automated suggestions based on current performance:
- **Slow Components**: Components exceeding 16ms render time
- **High Memory Usage**: When memory usage exceeds 50MB
- **Optimization Tips**: Specific recommendations for improvements

#### 5. **Dashboard Controls**
- **Live Monitoring Toggle**: Enable/disable real-time monitoring
- **Generate Report**: Export comprehensive performance data
- **Clear Data**: Reset all collected performance metrics

---

## 🖥️ Browser Console Tools

### Primary Analysis Commands

#### 1. **Quick Performance Check**
```javascript
performanceAnalysis.quickCheck()
```
**What it does**: Provides immediate overview of current performance
**Output**: 
- Average render times
- Current memory usage
- Number of monitored components
- Basic performance status

**Example Output**:
```
📊 PERFORMANCE OVERVIEW
========================
Render Times (avg): 12.34ms
Memory Usage: 45.67MB
Components monitored: 8
```

#### 2. **Component-Specific Analysis**
```javascript
performanceAnalysis.analyzeComponent('ComponentName')
```
**What it does**: Detailed analysis of specific component performance
**Parameters**: Component name (string)
**Output**:
- Render count and timing statistics
- Performance status and recommendations
- Optimization suggestions

**Example**:
```javascript
performanceAnalysis.analyzeComponent('Analysis')
```

#### 3. **Comprehensive Performance Report**
```javascript
performanceAnalysis.generateFullReport()
```
**What it does**: Generates complete performance analysis with recommendations
**Features**:
- Full performance metrics
- Memory leak detection
- Performance score calculation
- Downloadable JSON report
- Automated recommendations

#### 4. **Memory Leak Detection**
```javascript
performanceAnalysis.checkMemoryLeaks()
```
**What it does**: Analyzes memory usage patterns for potential leaks
**Detection Logic**:
- Tracks memory usage trends
- Identifies consistent growth patterns
- Provides leak warnings and recommendations

#### 5. **Performance Comparison**
```javascript
performanceAnalysis.compareAnalysisComponent()
```
**What it does**: Demonstrates before/after performance comparison
**Use Case**: Measuring impact of optimizations

#### 6. **Automated Performance Testing**
```javascript
performanceAnalysis.runPerformanceTests()
```
**What it does**: Runs comprehensive performance test suite
**Features**:
- Component render testing
- Memory usage analysis
- Data processing benchmarks
- Exportable test results

### Advanced Console Commands

#### 1. **Direct Performance Monitor Access**
```javascript
// Get raw performance data
window.performanceMonitor.getPerformanceData()

// Record custom render time
window.performanceMonitor.recordRender('MyComponent', 15.5)

// Record memory usage
window.performanceMonitor.recordMemory(2048000)
```

#### 2. **Performance Comparator**
```javascript
// Set baseline performance
window.performanceComparator.setBaseline('ComponentName', {
  renderTime: 25,
  memoryUsage: 1024000
})

// Record current performance
window.performanceComparator.recordCurrent('ComponentName', {
  renderTime: 12,
  memoryUsage: 512000
})

// Compare performance
window.performanceComparator.comparePerformance('ComponentName')
```

#### 3. **Test Suite Commands**
```javascript
// Test component render performance
window.PerformanceTestSuite.testComponentRender('ComponentName', 50)

// Test memory usage
window.PerformanceTestSuite.testMemoryUsage('Operation', () => {
  // Your operation here
}, 20)

// Test data processing
window.PerformanceTestSuite.testDataProcessing(processingFunction, testData, 100)
```

---

## 🔍 Component Performance Analysis

### Understanding Component Metrics

#### 1. **Render Time Analysis**
- **Good Performance**: < 16ms (60fps)
- **Acceptable**: 16-32ms (30fps)
- **Needs Optimization**: > 32ms

#### 2. **Render Count Tracking**
- **High Count**: May indicate unnecessary re-renders
- **Low Count**: Component is efficiently rendered
- **Inconsistent**: May indicate performance issues

#### 3. **Performance Status Indicators**
- **Green (Good)**: Component performing well
- **Yellow (Warning)**: Performance concerns
- **Red (Critical)**: Immediate optimization needed

### Component Optimization Workflow

#### Step 1: Identify Slow Components
```javascript
// Get overview of all components
const data = window.performanceMonitor.getPerformanceData();

// Find slow components
const slowComponents = Object.entries(data.componentMetrics)
  .filter(([name, metrics]) => metrics.averageRenderTime > 16)
  .sort((a, b) => b[1].averageRenderTime - a[1].averageRenderTime);

console.log('Slow components:', slowComponents);
```

#### Step 2: Analyze Specific Component
```javascript
// Detailed analysis of slow component
performanceAnalysis.analyzeComponent('SlowComponentName');
```

#### Step 3: Apply Optimizations
Common optimization strategies:
- **React.memo()**: Prevent unnecessary re-renders
- **useCallback()**: Stable function references
- **useMemo()**: Memoize expensive calculations
- **Code splitting**: Lazy load heavy components

#### Step 4: Measure Improvements
```javascript
// Set baseline before optimization
window.performanceComparator.setBaseline('ComponentName', {
  renderTime: 28,
  memoryUsage: 5000000
});

// Apply optimizations...

// Record improved performance
window.performanceComparator.recordCurrent('ComponentName', {
  renderTime: 12,
  memoryUsage: 2800000
});

// Compare results
window.performanceComparator.comparePerformance('ComponentName');
```

---

## 🧠 Memory Analysis

### Memory Monitoring Features

#### 1. **Real-time Memory Tracking**
```javascript
// Get current memory usage
const memoryData = window.performanceMonitor.getPerformanceData().memoryUsage;
console.log('Memory usage:', memoryData.map(m => (m / 1024 / 1024).toFixed(2) + 'MB'));
```

#### 2. **Memory Leak Detection**
```javascript
// Check for memory leaks
const hasLeaks = performanceAnalysis.checkMemoryLeaks();
if (hasLeaks) {
  console.log('⚠️ Potential memory leaks detected');
}
```

#### 3. **Memory Usage Patterns**
- **Stable**: Memory usage remains relatively constant
- **Growing**: Consistent memory increase (potential leak)
- **Volatile**: Frequent memory allocation/deallocation

### Memory Optimization Guidelines

#### 1. **Acceptable Memory Usage**
- **Low Usage**: < 30MB
- **Moderate Usage**: 30-50MB
- **High Usage**: 50-100MB
- **Critical**: > 100MB

#### 2. **Common Memory Issues**
- **Event Listeners**: Not properly cleaned up
- **Closures**: Holding references to large objects
- **Timers**: setInterval/setTimeout not cleared
- **DOM References**: Retained references to unmounted components

#### 3. **Memory Optimization Strategies**
```javascript
// Example: Proper cleanup in useEffect
useEffect(() => {
  const handleScroll = () => { /* handler */ };
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

---

## 📈 Performance Comparison

### Before/After Analysis Workflow

#### 1. **Setting Baselines**
```javascript
// Before optimization - set baseline
window.performanceComparator.setBaseline('PortfolioGrid', {
  renderTime: 45,
  memoryUsage: 8000000,
  loadTime: 2000
});
```

#### 2. **Apply Optimizations**
Implement performance improvements:
- Add memoization
- Implement lazy loading
- Optimize data structures
- Remove unnecessary re-renders

#### 3. **Record Current Performance**
```javascript
// After optimization - record current
window.performanceComparator.recordCurrent('PortfolioGrid', {
  renderTime: 18,
  memoryUsage: 4200000,
  loadTime: 800
});
```

#### 4. **Compare Results**
```javascript
// Generate comparison
const comparison = window.performanceComparator.comparePerformance('PortfolioGrid');
console.log('Performance improvement:', comparison);
```

#### 5. **Generate Report**
```javascript
// Comprehensive comparison report
const report = window.performanceComparator.generateComparisonReport();
console.log('Full report:', report);

// Export data
window.performanceComparator.exportData();
```

### Understanding Comparison Results

#### 1. **Improvement Metrics**
- **Negative % Change**: Performance improvement
- **Positive % Change**: Performance regression
- **Percentage**: Magnitude of change

#### 2. **Key Performance Indicators**
- **Render Time**: Target 40%+ improvement
- **Memory Usage**: Target 20%+ reduction
- **Load Time**: Target 30%+ improvement

---

## 🧪 Automated Testing

### Performance Test Suite

#### 1. **Full Test Suite**
```javascript
// Run comprehensive performance tests
window.PerformanceTestSuite.runFullSuite().then(results => {
  console.log('Test Results:', results);
  window.PerformanceTestSuite.exportResults(results);
});
```

#### 2. **Component Render Testing**
```javascript
// Test specific component render performance
window.PerformanceTestSuite.testComponentRender('MyComponent', 50).then(results => {
  console.log('Component render test:', results);
});
```

#### 3. **Memory Usage Testing**
```javascript
// Test memory usage during operations
window.PerformanceTestSuite.testMemoryUsage('DataProcessing', () => {
  // Your operation
  const data = Array.from({length: 1000}, (_, i) => ({id: i, value: Math.random()}));
  return data.map(item => ({...item, processed: true}));
}, 20).then(results => {
  console.log('Memory test results:', results);
});
```

#### 4. **Data Processing Testing**
```javascript
// Test data processing performance
const testData = Array.from({length: 10000}, (_, i) => ({id: i, value: i * 2}));
window.PerformanceTestSuite.testDataProcessing(
  data => data.filter(item => item.value > 1000),
  testData,
  100
);
```

### Test Result Analysis

#### 1. **Understanding Test Results**
- **Average Time**: Mean performance across iterations
- **Min/Max Time**: Performance range
- **Standard Deviation**: Performance consistency
- **Memory Delta**: Memory usage change

#### 2. **Performance Benchmarks**
- **Render Time**: < 16ms per component
- **Memory Usage**: < 5MB per operation
- **Data Processing**: < 100ms per 10k items

---

## 🔧 Real-World Usage Examples

### Example 1: Optimizing a Slow Component

#### Problem: Analysis component is slow (28ms render time)

```javascript
// Step 1: Identify the problem
performanceAnalysis.analyzeComponent('Analysis');
// Output: Average render time: 28ms (Slow)

// Step 2: Set baseline
window.performanceComparator.setBaseline('Analysis', {
  renderTime: 28,
  memoryUsage: 5000000
});

// Step 3: Apply optimizations (in your code)
// - Add React.memo()
// - Use useCallback for event handlers
// - Memoize expensive calculations

// Step 4: Test improvements
performanceAnalysis.analyzeComponent('Analysis');
// Output: Average render time: 12ms (Good)

// Step 5: Record and compare
window.performanceComparator.recordCurrent('Analysis', {
  renderTime: 12,
  memoryUsage: 2800000
});

const comparison = window.performanceComparator.comparePerformance('Analysis');
console.log('Improvement:', comparison);
// Output: 57% render time improvement, 44% memory reduction
```

### Example 2: Detecting Memory Leaks

#### Problem: Memory usage keeps growing

```javascript
// Step 1: Check for memory leaks
const hasLeaks = performanceAnalysis.checkMemoryLeaks();
if (hasLeaks) {
  console.log('⚠️ Memory leak detected');
  
  // Step 2: Analyze memory patterns
  const memoryData = window.performanceMonitor.getPerformanceData().memoryUsage;
  console.log('Memory trend:', memoryData.slice(-10));
  
  // Step 3: Generate detailed report
  const report = performanceAnalysis.generateFullReport();
  console.log('Memory analysis:', report);
}
```

### Example 3: Performance Regression Testing

#### Problem: Need to ensure new features don't hurt performance

```javascript
// Step 1: Set performance baselines for key components
const keyComponents = ['Analysis', 'PortfolioGrid', 'Dashboard'];
keyComponents.forEach(component => {
  performanceAnalysis.analyzeComponent(component);
});

// Step 2: Run automated tests
window.PerformanceTestSuite.runFullSuite().then(results => {
  console.log('Baseline performance:', results);
  
  // Step 3: After adding new features, run tests again
  // Compare results to detect regressions
});
```

### Example 4: Optimizing Data Processing

#### Problem: Large dataset processing is slow

```javascript
// Step 1: Benchmark current processing
const largeDataset = Array.from({length: 50000}, (_, i) => ({
  id: i,
  value: Math.random(),
  category: Math.floor(Math.random() * 10)
}));

// Test current processing function
const currentProcessing = (data) => {
  return data.filter(item => item.value > 0.5)
             .map(item => ({...item, processed: true}))
             .sort((a, b) => b.value - a.value);
};

window.PerformanceTestSuite.testDataProcessing(
  currentProcessing,
  largeDataset,
  10
).then(results => {
  console.log('Current processing:', results);
  
  // Step 2: Optimize with chunked processing
  const optimizedProcessing = (data) => {
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    
    return chunks.map(chunk => 
      chunk.filter(item => item.value > 0.5)
           .map(item => ({...item, processed: true}))
    ).flat().sort((a, b) => b.value - a.value);
  };
  
  // Step 3: Test optimized version
  window.PerformanceTestSuite.testDataProcessing(
    optimizedProcessing,
    largeDataset,
    10
  ).then(optimizedResults => {
    console.log('Optimized processing:', optimizedResults);
    
    // Calculate improvement
    const improvement = ((results.avgProcessingTime - optimizedResults.avgProcessingTime) / results.avgProcessingTime) * 100;
    console.log(`Processing improvement: ${improvement.toFixed(1)}%`);
  });
});
```

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Performance Monitoring Not Working**
**Symptoms**: No performance data, dashboard not appearing
**Solutions**:
- Ensure running in development mode
- Check browser console for initialization messages
- Verify performance monitoring is enabled in config

#### 2. **No Component Data**
**Symptoms**: Component metrics table is empty
**Solutions**:
- Navigate through the application to generate data
- Ensure components are properly instrumented
- Check for React component name conflicts

#### 3. **Memory Monitoring Issues**
**Symptoms**: Memory data not updating
**Solutions**:
- Enable Chrome/Firefox memory profiling
- Check if `performance.memory` is available
- Ensure monitoring interval is appropriate

#### 4. **Dashboard Not Visible**
**Symptoms**: Speed icon not showing
**Solutions**:
- Verify development mode
- Check for CSS conflicts
- Ensure proper component import

### Debugging Commands

```javascript
// Check monitoring status
console.log('Performance monitor:', window.performanceMonitor);

// Check data availability
console.log('Performance data:', window.performanceMonitor?.getPerformanceData());

// Check monitoring config
console.log('Monitoring enabled:', window.performanceMonitor?.isMonitoring);

// Manual data refresh
window.performanceMonitor?.clearData();
```

---

## 🚀 Advanced Features

### 1. **Performance Budget Monitoring**

The Performance Budget Monitor helps you set and track performance thresholds to ensure your application meets performance targets.

#### Setting Performance Budgets

```javascript
// Set performance budgets for your application
performanceAnalysis.setPerformanceBudgets({
  maxRenderTime: 16,        // Maximum render time in ms (for 60fps)
  maxMemoryUsage: 50,       // Maximum memory usage in MB
  maxLoadTime: 1000,        // Maximum load time in ms
  maxBundleSize: 2          // Maximum bundle size in MB
});

// Check current budget status
const budgetStatus = performanceAnalysis.checkBudgetStatus();
console.log('Budget compliance:', budgetStatus);
```

#### Budget Monitoring Features

```javascript
// Get detailed budget analysis
const budgetReport = performanceAnalysis.checkBudgetStatus();

// Example output:
{
  compliant: false,
  violations: [
    {
      metric: 'renderTime',
      current: 25.5,
      budget: 16,
      violation: 59.4,
      severity: 'high'
    }
  ],
  score: 75,
  recommendations: [
    'Consider optimizing components with render times > 16ms',
    'Use React.memo() for frequently re-rendering components'
  ]
}
```

#### Automated Budget Checking

```javascript
// Set up automated budget checking
const monitorBudgets = () => {
  setInterval(() => {
    const status = performanceAnalysis.checkBudgetStatus();
    if (!status.compliant) {
      console.warn('⚠️ Performance budget violations detected:', status.violations);
      
      // Optionally send alerts or notifications
      if (status.violations.some(v => v.severity === 'critical')) {
        console.error('🚨 Critical performance issues detected!');
      }
    }
  }, 30000); // Check every 30 seconds
};

// Start monitoring
monitorBudgets();
```

### 2. **Component Dependency Tracking**

Track performance relationships between components to identify bottlenecks in your component hierarchy.

#### Basic Dependency Analysis

```javascript
// Analyze component dependencies
const dependencyReport = performanceAnalysis.analyzeDependencies();
console.log('Component dependencies:', dependencyReport);

// Example output:
{
  dependencies: {
    'ParentComponent': {
      children: ['ChildComponent1', 'ChildComponent2'],
      avgRenderTime: 45.2,
      impact: 'high'
    }
  },
  bottlenecks: [
    {
      component: 'ParentComponent',
      reason: 'Slow parent affects 5 child components',
      recommendation: 'Optimize ParentComponent rendering'
    }
  ],
  optimizationPriority: ['ParentComponent', 'ChildComponent1']
}
```

#### Advanced Dependency Tracking

```javascript
// Track specific component relationships
const trackComponentRelationship = (parentName, childName) => {
  // This happens automatically when using the performance hooks
  // But you can also manually track relationships
  
  console.log(`Tracking relationship: ${parentName} -> ${childName}`);
  
  // Get relationship performance data
  const relationship = performanceAnalysis.analyzeDependencies()
    .dependencies[parentName];
    
  if (relationship && relationship.children.includes(childName)) {
    console.log(`${childName} is affected by ${parentName} performance`);
  }
};

// Example usage
trackComponentRelationship('Dashboard', 'UserProfile');
```

#### Dependency Performance Optimization

```javascript
// Get optimization suggestions based on dependencies
const getOptimizationPlan = () => {
  const dependencies = performanceAnalysis.analyzeDependencies();
  
  // Priority optimization plan
  const plan = dependencies.optimizationPriority.map(component => ({
    component,
    currentPerformance: window.performanceMonitor
      .getPerformanceData().componentMetrics[component],
    recommendations: [
      `Optimize ${component} to improve dependent components`,
      `Consider memoization for ${component}`,
      `Check for unnecessary re-renders in ${component}`
    ]
  }));
  
  console.log('Optimization plan:', plan);
  return plan;
};
```

### 3. **Performance Profiling Sessions**

Conduct detailed performance profiling sessions to analyze your application's behavior over time.

#### Starting a Profiling Session

```javascript
// Start a comprehensive profiling session
const sessionId = performanceAnalysis.startProfilingSession({
  duration: 60000,          // Profile for 60 seconds
  interval: 1000,           // Take snapshots every second
  includeMemory: true,      // Include memory profiling
  includeNetwork: false,    // Skip network profiling
  components: ['Dashboard', 'UserProfile'] // Focus on specific components
});

console.log(`Profiling session started: ${sessionId}`);
```

#### Taking Manual Snapshots

```javascript
// Take manual performance snapshots during profiling
const snapshot = performanceAnalysis.takeSnapshot('user-interaction');

// Example snapshot data:
{
  timestamp: '2025-07-19T08:53:00.000Z',
  label: 'user-interaction',
  performance: {
    renderTimes: [12.5, 8.3, 15.7],
    memoryUsage: 45.2,
    componentMetrics: {
      'Dashboard': { renderTime: 12.5, renderCount: 1 }
    }
  },
  userAction: 'Button click on Dashboard'
}
```

#### Ending and Analyzing Profiling Sessions

```javascript
// End the profiling session and get comprehensive report
const profilingReport = performanceAnalysis.endProfilingSession(sessionId);

console.log('Profiling complete:', profilingReport);

// Example report structure:
{
  sessionId: 'session_1642589580000',
  duration: 60000,
  snapshots: 60,
  performance: {
    avgRenderTime: 14.2,
    maxRenderTime: 28.5,
    minRenderTime: 6.1,
    memoryTrend: 'stable',
    performanceScore: 82
  },
  insights: [
    'Performance is generally good',
    'Component "Dashboard" had 3 slow renders',
    'Memory usage remained stable throughout session'
  ],
  recommendations: [
    'Optimize Dashboard component for better consistency',
    'Consider lazy loading for non-critical components'
  ]
}
```

#### Advanced Profiling Features

```javascript
// Profile specific user interactions
const profileUserInteraction = async (interactionName, interaction) => {
  const sessionId = performanceAnalysis.startProfilingSession({
    duration: 10000,
    interval: 100
  });
  
  // Take before snapshot
  performanceAnalysis.takeSnapshot(`before-${interactionName}`);
  
  // Execute the interaction
  await interaction();
  
  // Take after snapshot
  performanceAnalysis.takeSnapshot(`after-${interactionName}`);
  
  // End session and analyze
  const report = performanceAnalysis.endProfilingSession(sessionId);
  
  console.log(`Interaction "${interactionName}" performance:`, report);
  return report;
};

// Example usage
profileUserInteraction('data-filter', async () => {
  // Simulate user filtering data
  document.querySelector('#filter-input').value = 'test';
  document.querySelector('#filter-button').click();
  await new Promise(resolve => setTimeout(resolve, 2000));
});
```

### 4. **Performance Diagnostics Suite**

Run comprehensive diagnostics to identify and resolve performance issues.

#### Full Diagnostic Scan

```javascript
// Run complete performance diagnostics
const diagnostics = performanceAnalysis.runPerformanceDiagnostics();

console.log('Performance diagnostics:', diagnostics);

// Example diagnostic report:
{
  overall: {
    score: 75,
    grade: 'B',
    status: 'good'
  },
  issues: [
    {
      type: 'slow-component',
      component: 'DataTable',
      severity: 'medium',
      description: 'Component renders slower than recommended',
      recommendation: 'Consider virtualization for large datasets'
    },
    {
      type: 'memory-trend',
      severity: 'low',
      description: 'Minor memory growth detected',
      recommendation: 'Monitor for potential memory leaks'
    }
  ],
  optimizations: [
    {
      priority: 'high',
      component: 'DataTable',
      strategy: 'virtualization',
      expectedImprovement: '40% render time reduction'
    }
  ],
  metrics: {
    avgRenderTime: 18.5,
    memoryUsage: 42.1,
    componentCount: 12,
    slowComponents: 2
  }
}
```

#### Targeted Diagnostics

```javascript
// Run diagnostics on specific components
const componentDiagnostics = performanceAnalysis.runPerformanceDiagnostics({
  focus: 'components',
  components: ['Dashboard', 'UserProfile', 'DataTable']
});

// Run memory-focused diagnostics
const memoryDiagnostics = performanceAnalysis.runPerformanceDiagnostics({
  focus: 'memory',
  duration: 30000
});

// Run render performance diagnostics
const renderDiagnostics = performanceAnalysis.runPerformanceDiagnostics({
  focus: 'rendering',
  threshold: 16 // Flag components slower than 16ms
});
```

### 5. **Integration with Development Workflow**

#### Development Mode Features

```javascript
// Enable development-specific performance features
if (process.env.NODE_ENV === 'development') {
  // Auto-start profiling on app load
  performanceAnalysis.startProfilingSession({
    duration: 300000, // 5 minutes
    interval: 5000,   // Every 5 seconds
    autoEnd: true
  });
  
  // Set up development budgets (more lenient)
  performanceAnalysis.setPerformanceBudgets({
    maxRenderTime: 32,  // More lenient for development
    maxMemoryUsage: 100,
    maxLoadTime: 3000
  });
  
  // Enable console warnings for performance issues
  const checkInterval = setInterval(() => {
    const diagnostics = performanceAnalysis.runPerformanceDiagnostics();
    if (diagnostics.issues.length > 0) {
      console.warn('⚠️ Performance issues detected:', diagnostics.issues);
    }
  }, 60000); // Check every minute
}
```

#### Production Monitoring Setup

```javascript
// Production-ready performance monitoring
if (process.env.NODE_ENV === 'production') {
  // Set strict performance budgets
  performanceAnalysis.setPerformanceBudgets({
    maxRenderTime: 16,
    maxMemoryUsage: 50,
    maxLoadTime: 1000
  });
  
  // Silent monitoring with error reporting
  const monitorProduction = () => {
    const budgetStatus = performanceAnalysis.checkBudgetStatus();
    if (!budgetStatus.compliant) {
      // Send to analytics/monitoring service
      analytics.track('performance_budget_violation', {
        violations: budgetStatus.violations,
        score: budgetStatus.score
      });
    }
  };
  
  setInterval(monitorProduction, 300000); // Check every 5 minutes
}
```

### 6. **Custom Performance Monitoring**

```javascript
// Create custom performance monitor
const customMonitor = {
  measureOperation: (name, operation) => {
    const start = performance.now();
    const startMemory = performance.memory?.usedJSHeapSize || 0;
    
    const result = operation();
    
    const end = performance.now();
    const endMemory = performance.memory?.usedJSHeapSize || 0;
    
    console.log(`${name} Performance:`, {
      duration: (end - start).toFixed(2) + 'ms',
      memoryDelta: ((endMemory - startMemory) / 1024 / 1024).toFixed(2) + 'MB',
      result
    });
    
    return result;
  }
};

// Use custom monitor
customMonitor.measureOperation('Portfolio Filtering', () => {
  return portfolioData.filter(item => item.active);
});
```

### 2. **Performance Budgets**

```javascript
// Set performance budgets
const performanceBudgets = {
  maxRenderTime: 16, // 16ms for 60fps
  maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  maxLoadTime: 1000 // 1 second
};

// Check against budgets
const checkBudgets = () => {
  const data = window.performanceMonitor.getPerformanceData();
  const violations = [];
  
  // Check render time budget
  Object.entries(data.componentMetrics).forEach(([name, metrics]) => {
    if (metrics.averageRenderTime > performanceBudgets.maxRenderTime) {
      violations.push(`${name}: Render time ${metrics.averageRenderTime}ms exceeds budget`);
    }
  });
  
  // Check memory budget
  const currentMemory = data.memoryUsage[data.memoryUsage.length - 1];
  if (currentMemory > performanceBudgets.maxMemoryUsage) {
    violations.push(`Memory usage ${(currentMemory / 1024 / 1024).toFixed(2)}MB exceeds budget`);
  }
  
  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
  } else {
    console.log('✅ All performance budgets met');
  }
  
  return violations;
};
```

### 3. **Automated Performance CI/CD Integration**

```javascript
// Export performance data for CI/CD
const exportPerformanceData = () => {
  const data = window.performanceMonitor.getPerformanceData();
  const report = {
    timestamp: new Date().toISOString(),
    metrics: {
      avgRenderTime: data.renderTimes.reduce((sum, t) => sum + t, 0) / data.renderTimes.length,
      maxMemoryUsage: Math.max(...data.memoryUsage),
      componentCount: Object.keys(data.componentMetrics).length,
      slowComponents: Object.values(data.componentMetrics).filter(m => m.averageRenderTime > 16).length
    },
    budgetViolations: checkBudgets()
  };
  
  // Export for CI/CD system
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'performance-ci-report.json';
  a.click();
  URL.revokeObjectURL(url);
  
  return report;
};
```

---

## 📊 Performance Metrics Reference

### Target Performance Metrics

| Metric | Excellent | Good | Needs Work | Critical |
|--------|-----------|------|------------|----------|
| Render Time | < 8ms | 8-16ms | 16-32ms | > 32ms |
| Memory Usage | < 20MB | 20-50MB | 50-100MB | > 100MB |
| Load Time | < 500ms | 500ms-1s | 1-3s | > 3s |
| Bundle Size | < 1MB | 1-2MB | 2-5MB | > 5MB |

### Component Performance Categories

- **Fast Components**: < 16ms render time
- **Slow Components**: > 16ms render time
- **Critical Components**: > 32ms render time
- **Memory Intensive**: > 5MB memory usage per render

---

## 🎯 Best Practices

### 1. **Regular Performance Monitoring**
- Check performance dashboard weekly
- Set up automated performance tests
- Monitor key metrics continuously
- Track performance trends over time

### 2. **Performance Budget Management**
- Set realistic performance budgets
- Monitor budget compliance
- Address violations promptly
- Communicate performance goals to team

### 3. **Optimization Workflow**
- Identify bottlenecks first
- Set baselines before optimization
- Apply targeted optimizations
- Measure and validate improvements
- Document optimization strategies

### 4. **Team Collaboration**
- Share performance reports with team
- Establish performance review processes
- Train team on performance tools
- Create performance documentation

---

## 🔗 Quick Reference

### Essential Commands
```javascript
// Quick performance check
performanceAnalysis.quickCheck()

// Component analysis
performanceAnalysis.analyzeComponent('ComponentName')

// Full report
performanceAnalysis.generateFullReport()

// Memory leak check
performanceAnalysis.checkMemoryLeaks()

// Performance tests
performanceAnalysis.runPerformanceTests()

// NEW: Performance budget monitoring
performanceAnalysis.setPerformanceBudgets({
  maxRenderTime: 16,
  maxMemoryUsage: 50,
  maxLoadTime: 1000
})
performanceAnalysis.checkBudgetStatus()

// NEW: Component dependency tracking
performanceAnalysis.analyzeDependencies()

// NEW: Performance profiling sessions
const sessionId = performanceAnalysis.startProfilingSession()
performanceAnalysis.takeSnapshot('user-action')
performanceAnalysis.endProfilingSession(sessionId)

// NEW: Performance diagnostics
performanceAnalysis.runPerformanceDiagnostics()
```

### React Integration Commands
```javascript
// Import hooks and HOCs
import { 
  usePerformanceMonitoring,
  usePerformanceMonitor,
  withPerformanceMonitoring,
  performanceLogger,
  initializePerformanceMonitoring
} from 'performance-analyzer-lib';

// Hook usage
const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring('ComponentName');

// HOC usage
const MonitoredComponent = withPerformanceMonitoring(MyComponent, 'MyComponent');

// Logger usage
performanceLogger.info('Operation completed');
performanceLogger.timing('Operation', startTime);
performanceLogger.memory();
```

### Advanced API Commands
```javascript
// Bundle analysis
analyzeBundleSize().then(analysis => console.log(analysis));

// Memory leak detection
const stopMonitoring = detectMemoryLeaks();

// Optimization suggestions
getOptimizationSuggestions('ComponentName');

// NEW: Performance budget management
setPerformanceBudgets({ maxRenderTime: 16, maxMemoryUsage: 50 });
checkBudgetStatus();

// NEW: Component dependency analysis
analyzeDependencies();

// NEW: Profiling sessions
startProfilingSession({ duration: 60000, interval: 1000 });
takeSnapshot('interaction-label');
endProfilingSession(sessionId);

// NEW: Performance diagnostics
runPerformanceDiagnostics();
runPerformanceDiagnostics({ focus: 'components' });
runPerformanceDiagnostics({ focus: 'memory' });

// Direct monitor access
window.performanceMonitor.getPerformanceData();
window.performanceMonitor.recordRender('Component', 15.5);
window.performanceMonitor.clearData();
```

### Key Performance Indicators
- **Render Time**: < 16ms for 60fps
- **Memory Usage**: < 50MB typical
- **Component Efficiency**: 80%+ optimized
- **Bundle Size**: Minimized with lazy loading

---

**Happy Performance Monitoring! 🚀**

For additional help or questions, check the browser console for available commands and tools.
