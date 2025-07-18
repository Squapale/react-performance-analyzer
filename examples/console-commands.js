// Console Commands Examples
// Copy and paste these commands into your browser console for quick analysis

// ==========================================
// QUICK ANALYSIS COMMANDS
// ==========================================

// 1. Get performance overview
performanceAnalysis.quickCheck();

// 2. Analyze a specific component
performanceAnalysis.analyzeComponent('Analysis');

// 3. Check for memory leaks
performanceAnalysis.checkMemoryLeaks();

// 4. Generate comprehensive report
performanceAnalysis.generateFullReport();

// 5. Run automated tests
performanceAnalysis.runPerformanceTests();

// ==========================================
// PERFORMANCE COMPARISON WORKFLOW
// ==========================================

// Step 1: Set baseline (before optimization)
performanceComparator.setBaseline('MyComponent', {
  renderTime: 28.5,
  memoryUsage: 5200000,
  loadTime: 1200
});

// Step 2: Make your optimizations in code...

// Step 3: Record current performance (after optimization)
performanceComparator.recordCurrent('MyComponent', {
  renderTime: 12.3,
  memoryUsage: 2800000,
  loadTime: 650
});

// Step 4: Compare performance
const comparison = performanceComparator.comparePerformance('MyComponent');
console.log('Performance Improvement:', comparison);

// Step 5: Generate full comparison report
const report = performanceComparator.generateComparisonReport();
console.log('Full Report:', report);

// ==========================================
// DETAILED TESTING EXAMPLES
// ==========================================

// Test component render performance
PerformanceTestSuite.testComponentRender('MyComponent', 50)
  .then(results => console.log('Render Test:', results));

// Test memory usage
PerformanceTestSuite.testMemoryUsage(
  'DataProcessing',
  () => {
    // Your expensive operation here
    const data = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: Math.random() }));
    return data.map(item => ({ ...item, processed: true }));
  },
  20
).then(results => console.log('Memory Test:', results));

// Test data processing performance
const testData = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: Math.random() }));
const processingResults = PerformanceTestSuite.testDataProcessing(
  (data) => data.filter(item => item.value > 0.5).map(item => ({ ...item, filtered: true })),
  testData,
  100
);
console.log('Processing Test:', processingResults);

// ==========================================
// MONITORING AND REPORTING
// ==========================================

// Get current performance data
const currentData = performanceMonitor.getPerformanceData();
console.log('Current Performance:', currentData);

// Get performance report
const performanceReport = getPerformanceReport();
console.log('Performance Report:', performanceReport);

// Analyze bundle sizes
analyzeBundles().then(analysis => console.log('Bundle Analysis:', analysis));

// Export performance data
performanceComparator.exportData();

// ==========================================
// ADVANCED ANALYSIS
// ==========================================

// Custom benchmark
performanceComparator.benchmark('MyOperation', () => {
  // Your operation to benchmark
  const result = complexCalculation();
  return result;
}, 100);

// Clear all performance data
performanceMonitor.clearData();

// Stop monitoring
performanceMonitor.stopMonitoring();

// Start monitoring again
performanceMonitor.startMonitoring();

// ==========================================
// USAGE PATTERNS
// ==========================================

// Pattern 1: Before/After Optimization
console.log('🔄 OPTIMIZATION WORKFLOW');
performanceComparator.setBaseline('Component', { renderTime: 30, memoryUsage: 5000000 });
// ... make optimizations ...
performanceComparator.recordCurrent('Component', { renderTime: 15, memoryUsage: 2500000 });
console.log('Comparison:', performanceComparator.comparePerformance('Component'));

// Pattern 2: Continuous Monitoring
console.log('📊 MONITORING WORKFLOW');
setInterval(() => {
  const data = performanceAnalysis.quickCheck();
  if (data && data.renderTimes.length > 0) {
    const avg = data.renderTimes.reduce((sum, time) => sum + time, 0) / data.renderTimes.length;
    if (avg > 16) {
      console.warn('⚠️ Performance issue detected:', avg.toFixed(2) + 'ms');
    }
  }
}, 10000); // Check every 10 seconds

// Pattern 3: Automated Testing
console.log('🧪 TESTING WORKFLOW');
PerformanceTestSuite.runFullSuite()
  .then(results => {
    console.log('Test Results:', results);
    PerformanceTestSuite.exportResults(results);
  })
  .catch(error => console.error('Test failed:', error));

// Pattern 4: Memory Leak Detection
console.log('🧠 MEMORY LEAK DETECTION');
const memoryLeakCheck = setInterval(() => {
  const hasLeaks = performanceAnalysis.checkMemoryLeaks();
  if (hasLeaks) {
    console.warn('⚠️ Potential memory leak detected!');
    clearInterval(memoryLeakCheck);
  }
}, 30000); // Check every 30 seconds
