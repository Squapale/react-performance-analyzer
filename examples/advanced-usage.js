// Advanced Usage Example
// This example demonstrates advanced features and best practices

import React, { useState, useEffect, useMemo } from 'react';
import { 
  usePerformanceMonitoring, 
  withPerformanceMonitoring,
  PerformanceDashboard,
  performanceComparator,
  PerformanceTestSuite 
} from 'performance-analyzer-lib';

// Component with performance monitoring HOC
const ExpensiveComponent = withPerformanceMonitoring(
  ({ data }) => {
    const processedData = useMemo(() => {
      // Expensive computation
      return data.map(item => ({
        ...item,
        computed: item.value * Math.random()
      }));
    }, [data]);

    return (
      <div>
        <h3>Expensive Component</h3>
        <p>Processing {processedData.length} items</p>
      </div>
    );
  },
  'ExpensiveComponent'
);

// Advanced monitoring with performance comparison
const AdvancedComponent = () => {
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring('AdvancedComponent');
  const [data, setData] = useState([]);
  const [isOptimized, setIsOptimized] = useState(false);

  // Simulate optimization toggle
  const toggleOptimization = () => {
    setIsOptimized(!isOptimized);
    
    // Record baseline before optimization
    if (!isOptimized) {
      performanceComparator.setBaseline('AdvancedComponent', {
        renderTime: 25.5,
        memoryUsage: 4800000
      });
    } else {
      // Record optimized performance
      performanceComparator.recordCurrent('AdvancedComponent', {
        renderTime: 12.8,
        memoryUsage: 2600000
      });
      
      // Compare performance
      const comparison = performanceComparator.comparePerformance('AdvancedComponent');
      console.log('Performance Comparison:', comparison);
    }
  };

  // Load test data
  useEffect(() => {
    const loadData = async () => {
      startTiming('data-load');
      
      // Simulate data loading
      const testData = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        value: Math.random() * 100
      }));
      
      setData(testData);
      endTiming('data-load');
    };

    loadData();
  }, [startTiming, endTiming]);

  // Run performance benchmarks
  const runBenchmarks = async () => {
    console.log('🧪 Running Performance Benchmarks...');
    
    // Test component rendering
    const renderTest = await PerformanceTestSuite.testComponentRender('AdvancedComponent', 50);
    console.log('Render Test Results:', renderTest);
    
    // Test memory usage
    const memoryTest = await PerformanceTestSuite.testMemoryUsage(
      'DataProcessing',
      () => {
        const processed = data.map(item => ({ ...item, processed: true }));
        return processed;
      },
      20
    );
    console.log('Memory Test Results:', memoryTest);
    
    // Test data processing
    const processingTest = PerformanceTestSuite.testDataProcessing(
      (data) => data.filter(item => item.value > 50),
      data,
      100
    );
    console.log('Processing Test Results:', processingTest);
  };

  return (
    <div>
      <h2>Advanced Performance Monitoring</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={toggleOptimization}>
          {isOptimized ? 'Disable' : 'Enable'} Optimization
        </button>
        <button onClick={runBenchmarks} style={{ marginLeft: '10px' }}>
          Run Benchmarks
        </button>
        <button onClick={() => console.log(getMetrics())} style={{ marginLeft: '10px' }}>
          Show Metrics
        </button>
      </div>

      <ExpensiveComponent data={data} />
      
      {/* Embedded performance dashboard */}
      <div style={{ marginTop: '30px' }}>
        <h3>Performance Dashboard</h3>
        <PerformanceDashboard />
      </div>
    </div>
  );
};

// Example of automated performance testing
const AutomatedTestingExample = () => {
  const runFullTestSuite = async () => {
    console.log('🚀 Running Full Performance Test Suite...');
    
    try {
      const results = await PerformanceTestSuite.runFullSuite();
      console.log('Test Suite Results:', results);
      
      // Export results
      PerformanceTestSuite.exportResults(results);
      
      // Generate comparison report
      const report = performanceComparator.generateComparisonReport();
      console.log('Comparison Report:', report);
      
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  };

  return (
    <div>
      <h2>Automated Performance Testing</h2>
      <button onClick={runFullTestSuite}>
        Run Full Test Suite
      </button>
    </div>
  );
};

export { AdvancedComponent, AutomatedTestingExample };
export default AdvancedComponent;
