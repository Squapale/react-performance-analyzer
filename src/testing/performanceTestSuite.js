/**
 * Performance Testing Script
 * Run this in the browser console to test performance improvements
 */

// Performance testing utilities
const PerformanceTestSuite = {
  // Test component render performance
  testComponentRender: async (componentName, iterations = 50) => {
    console.log(`🧪 Testing ${componentName} render performance...`);
    
    const renderTimes = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      // Trigger a component re-render (simulate state change)
      if (window.performanceMonitor) {
        window.performanceMonitor.recordRender(componentName, 1);
      }
      
      const endTime = performance.now();
      renderTimes.push(endTime - startTime);
      
      // Small delay to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    const avgRenderTime = renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length;
    const minRenderTime = Math.min(...renderTimes);
    const maxRenderTime = Math.max(...renderTimes);
    
    const result = {
      componentName,
      iterations,
      avgRenderTime: avgRenderTime.toFixed(2),
      minRenderTime: minRenderTime.toFixed(2),
      maxRenderTime: maxRenderTime.toFixed(2),
      renderTimes,
    };
    
    console.log(`✅ ${componentName} Performance Test Results:`, result);
    return result;
  },

  // Test memory usage during operations
  testMemoryUsage: async (operationName, operation, iterations = 20) => {
    console.log(`🧠 Testing ${operationName} memory usage...`);
    
    const memorySnapshots = [];
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    for (let i = 0; i < iterations; i++) {
      const beforeMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      await operation();
      
      const afterMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      memorySnapshots.push({
        before: beforeMemory,
        after: afterMemory,
        delta: afterMemory - beforeMemory,
      });
      
      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    const avgMemoryDelta = memorySnapshots.reduce((sum, snapshot) => sum + snapshot.delta, 0) / memorySnapshots.length;
    const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    
    const result = {
      operationName,
      iterations,
      initialMemory: (initialMemory / 1024 / 1024).toFixed(2) + ' MB',
      finalMemory: (finalMemory / 1024 / 1024).toFixed(2) + ' MB',
      avgMemoryDelta: (avgMemoryDelta / 1024 / 1024).toFixed(2) + ' MB',
      totalMemoryChange: ((finalMemory - initialMemory) / 1024 / 1024).toFixed(2) + ' MB',
      memorySnapshots,
    };
    
    console.log(`✅ ${operationName} Memory Test Results:`, result);
    return result;
  },

  // Test data processing performance
  testDataProcessing: (processingFunction, testData, iterations = 100) => {
    console.log(`⚡ Testing data processing performance...`);
    
    const processingTimes = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      
      const result = processingFunction(testData);
      
      const endTime = performance.now();
      processingTimes.push(endTime - startTime);
    }
    
    const avgProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;
    const minProcessingTime = Math.min(...processingTimes);
    const maxProcessingTime = Math.max(...processingTimes);
    
    const result = {
      dataSize: Array.isArray(testData) ? testData.length : 'N/A',
      iterations,
      avgProcessingTime: avgProcessingTime.toFixed(2),
      minProcessingTime: minProcessingTime.toFixed(2),
      maxProcessingTime: maxProcessingTime.toFixed(2),
      processingTimes,
    };
    
    console.log(`✅ Data Processing Test Results:`, result);
    return result;
  },

  // Run comprehensive performance test suite
  runFullSuite: async () => {
    console.log('🚀 Starting Full Performance Test Suite...');
    
    const results = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      tests: [],
    };
    
    // Test 1: Component render performance
    try {
      const renderTest = await PerformanceTestSuite.testComponentRender('TestComponent', 30);
      results.tests.push({ type: 'componentRender', ...renderTest });
    } catch (error) {
      console.error('❌ Component render test failed:', error);
    }
    
    // Test 2: Memory usage test
    try {
      const memoryTest = await PerformanceTestSuite.testMemoryUsage(
        'DataProcessing',
        () => {
          // Simulate data processing
          const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() }));
          return data.map(item => ({ ...item, processed: true }));
        },
        10
      );
      results.tests.push({ type: 'memoryUsage', ...memoryTest });
    } catch (error) {
      console.error('❌ Memory usage test failed:', error);
    }
    
    // Test 3: Data processing performance
    try {
      const testData = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: Math.random() }));
      const processingTest = PerformanceTestSuite.testDataProcessing(
        (data) => data.filter(item => item.value > 0.5).map(item => ({ ...item, filtered: true })),
        testData,
        50
      );
      results.tests.push({ type: 'dataProcessing', ...processingTest });
    } catch (error) {
      console.error('❌ Data processing test failed:', error);
    }
    
    // Generate summary
    const summary = {
      totalTests: results.tests.length,
      avgRenderTime: results.tests.find(t => t.type === 'componentRender')?.avgRenderTime || 'N/A',
      avgMemoryDelta: results.tests.find(t => t.type === 'memoryUsage')?.avgMemoryDelta || 'N/A',
      avgProcessingTime: results.tests.find(t => t.type === 'dataProcessing')?.avgProcessingTime || 'N/A',
    };
    
    results.summary = summary;
    
    console.log('🎉 Full Performance Test Suite Complete!');
    console.log('📊 Summary:', summary);
    
    return results;
  },

  // Export test results
  exportResults: (results) => {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📥 Test results exported');
  },
};

// Make available globally for easy testing
if (typeof window !== 'undefined') {
  window.PerformanceTestSuite = PerformanceTestSuite;
}

// Example usage instructions
console.log(`
🧪 Performance Testing Suite Available!

Usage Examples:
=================

1. Test component render performance:
   PerformanceTestSuite.testComponentRender('MyComponent', 50)

2. Test memory usage:
   PerformanceTestSuite.testMemoryUsage('MyOperation', () => { /* your operation */ }, 20)

3. Test data processing:
   PerformanceTestSuite.testDataProcessing(processingFunction, testData, 100)

4. Run full test suite:
   PerformanceTestSuite.runFullSuite().then(results => console.log(results))

5. Export results:
   PerformanceTestSuite.exportResults(results)

Quick Start:
============
// Run a quick performance test
PerformanceTestSuite.runFullSuite().then(results => {
  console.log('Test Results:', results);
  PerformanceTestSuite.exportResults(results);
});
`);

export default PerformanceTestSuite;
export { PerformanceTestSuite };
