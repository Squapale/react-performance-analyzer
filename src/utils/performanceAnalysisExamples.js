// Example: How to Use Performance Analysis Tools
// Copy and paste these examples into your browser console

// ========================================
// 1. QUICK PERFORMANCE CHECK
// ========================================

// Get current performance overview
const quickCheck = () => {
  if (!window.performanceMonitor) {
    console.log('⚠️ Performance monitoring not available. Make sure you\'re in development mode.');
    return;
  }

  const data = window.performanceMonitor.getPerformanceData();
  
  console.log('📊 PERFORMANCE OVERVIEW');
  console.log('========================');
  console.log('Render Times (avg):', data.renderTimes.length > 0 ? 
    (data.renderTimes.reduce((sum, time) => sum + time, 0) / data.renderTimes.length).toFixed(2) + 'ms' : 'No data');
  console.log('Memory Usage:', data.memoryUsage.length > 0 ? 
    (data.memoryUsage[data.memoryUsage.length - 1] / 1024 / 1024).toFixed(2) + 'MB' : 'No data');
  console.log('Components monitored:', Object.keys(data.componentMetrics).length);
  
  return data;
};

// ========================================
// 2. COMPONENT PERFORMANCE ANALYSIS
// ========================================

// Analyze specific component performance
const analyzeComponent = (componentName) => {
  const data = window.performanceMonitor.getPerformanceData();
  const component = data.componentMetrics[componentName];
  
  if (!component) {
    console.log(`❌ Component "${componentName}" not found in metrics`);
    console.log('Available components:', Object.keys(data.componentMetrics));
    return;
  }
  
  console.log(`📈 COMPONENT ANALYSIS: ${componentName}`);
  console.log('=======================================');
  console.log('Render Count:', component.renderCount);
  console.log('Average Render Time:', component.averageRenderTime.toFixed(2) + 'ms');
  console.log('Max Render Time:', component.maxRenderTime.toFixed(2) + 'ms');
  console.log('Performance Status:', component.averageRenderTime > 16 ? '🐌 Slow' : '⚡ Fast');
  
  if (component.averageRenderTime > 16) {
    console.log('💡 Recommendations:');
    console.log('  - Add React.memo() to prevent unnecessary re-renders');
    console.log('  - Use useCallback for event handlers');
    console.log('  - Consider memoizing expensive calculations');
  }
  
  return component;
};

// ========================================
// 3. BEFORE/AFTER COMPARISON
// ========================================

// Example: Compare Analysis component performance
const compareAnalysisComponent = () => {
  console.log('🔄 PERFORMANCE COMPARISON EXAMPLE');
  console.log('=================================');
  
  // Set baseline (simulated "before" optimization)
  window.performanceComparator.setBaseline('Analysis', {
    renderTime: 28.5,
    memoryUsage: 5200000,
    loadTime: 1200,
  });
  
  // Record current (simulated "after" optimization)
  window.performanceComparator.recordCurrent('Analysis', {
    renderTime: 12.3,
    memoryUsage: 2800000,
    loadTime: 650,
  });
  
  // Compare
  const comparison = window.performanceComparator.comparePerformance('Analysis');
  
  console.log('📊 COMPARISON RESULTS:');
  console.log('Render Time:', comparison.summary.renderTime.baseline + 'ms → ' + 
    comparison.summary.renderTime.current + 'ms (' + 
    comparison.summary.renderTime.percentChange.toFixed(1) + '%)');
  console.log('Memory Usage:', (comparison.summary.memoryUsage.baseline / 1024 / 1024).toFixed(2) + 'MB → ' + 
    (comparison.summary.memoryUsage.current / 1024 / 1024).toFixed(2) + 'MB (' + 
    comparison.summary.memoryUsage.percentChange.toFixed(1) + '%)');
  console.log('Load Time:', comparison.summary.loadTime.baseline + 'ms → ' + 
    comparison.summary.loadTime.current + 'ms (' + 
    comparison.summary.loadTime.percentChange.toFixed(1) + '%)');
  
  return comparison;
};

// ========================================
// 4. AUTOMATED PERFORMANCE TESTING
// ========================================

// Run comprehensive performance tests
const runPerformanceTests = async () => {
  console.log('🧪 RUNNING PERFORMANCE TESTS');
  console.log('============================');
  
  try {
    const results = await window.PerformanceTestSuite.runFullSuite();
    
    console.log('✅ TEST RESULTS:');
    console.log('Total Tests:', results.tests.length);
    console.log('Summary:', results.summary);
    
    // Export results
    window.PerformanceTestSuite.exportResults(results);
    console.log('📥 Results exported to download');
    
    return results;
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// ========================================
// 5. MEMORY LEAK DETECTION
// ========================================

// Check for potential memory leaks
const checkMemoryLeaks = () => {
  const data = window.performanceMonitor.getPerformanceData();
  const memoryUsage = data.memoryUsage;
  
  if (memoryUsage.length < 10) {
    console.log('📊 Not enough memory samples for leak detection');
    return false;
  }
  
  const recent = memoryUsage.slice(-5);
  const older = memoryUsage.slice(-10, -5);
  
  const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
  const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length;
  
  const increase = (recentAvg - olderAvg) / olderAvg * 100;
  
  console.log('🧠 MEMORY LEAK ANALYSIS');
  console.log('======================');
  console.log('Recent avg:', (recentAvg / 1024 / 1024).toFixed(2) + 'MB');
  console.log('Older avg:', (olderAvg / 1024 / 1024).toFixed(2) + 'MB');
  console.log('Increase:', increase.toFixed(1) + '%');
  
  if (increase > 10) {
    console.log('⚠️ POTENTIAL MEMORY LEAK DETECTED!');
    console.log('💡 Recommendations:');
    console.log('  - Check for event listeners that aren\'t cleaned up');
    console.log('  - Look for closures holding references to large objects');
    console.log('  - Ensure components properly unmount and cleanup');
    return true;
  } else {
    console.log('✅ Memory usage looks stable');
    return false;
  }
};

// ========================================
// 6. PERFORMANCE REGRESSION DETECTION
// ========================================

// Detect performance regressions
const detectRegressions = () => {
  const report = window.performanceComparator.generateComparisonReport();
  const regressions = report.detailedResults.filter(result => 
    Object.keys(result.regressions).length > 0
  );
  
  console.log('🔍 REGRESSION DETECTION');
  console.log('=======================');
  
  if (regressions.length > 0) {
    console.log('❌ REGRESSIONS FOUND:');
    regressions.forEach(regression => {
      console.log(`  - ${regression.componentName}:`, regression.regressions);
    });
    
    console.log('💡 Recommendations:');
    report.recommendations.forEach(rec => console.log('  -', rec));
  } else {
    console.log('✅ No performance regressions detected');
  }
  
  return regressions;
};

// ========================================
// 7. COMPREHENSIVE PERFORMANCE REPORT
// ========================================

// Generate and display comprehensive performance report
const generateFullReport = () => {
  console.log('📋 COMPREHENSIVE PERFORMANCE REPORT');
  console.log('===================================');
  
  const performanceData = quickCheck();
  const memoryLeaks = checkMemoryLeaks();
  const regressions = detectRegressions();
  
  console.log('\n📊 PERFORMANCE SCORE:');
  const data = window.performanceMonitor.getPerformanceData();
  const avgRenderTime = data.renderTimes.length > 0 ? 
    data.renderTimes.reduce((sum, time) => sum + time, 0) / data.renderTimes.length : 0;
  const currentMemory = data.memoryUsage.length > 0 ? 
    data.memoryUsage[data.memoryUsage.length - 1] / 1024 / 1024 : 0;
  
  let score = 100;
  
  if (avgRenderTime > 16) score -= 20;
  if (avgRenderTime > 32) score -= 20;
  if (currentMemory > 50) score -= 15;
  if (currentMemory > 100) score -= 15;
  if (memoryLeaks) score -= 20;
  if (regressions.length > 0) score -= 10;
  
  console.log('Performance Score:', Math.max(0, score) + '/100');
  
  if (score >= 90) console.log('🎉 Excellent performance!');
  else if (score >= 70) console.log('👍 Good performance');
  else if (score >= 50) console.log('⚠️ Needs optimization');
  else console.log('❌ Poor performance - immediate action needed');
  
  // Generate downloadable report
  const fullReport = {
    timestamp: new Date().toISOString(),
    score: Math.max(0, score),
    performanceData,
    memoryLeaks,
    regressions,
    recommendations: [
      avgRenderTime > 16 ? 'Optimize slow components' : null,
      currentMemory > 50 ? 'Reduce memory usage' : null,
      memoryLeaks ? 'Fix memory leaks' : null,
      regressions.length > 0 ? 'Address performance regressions' : null,
    ].filter(Boolean),
  };
  
  // Export full report
  const blob = new Blob([JSON.stringify(fullReport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('📥 Full report exported to download');
  
  return fullReport;
};

// ========================================
// QUICK COMMANDS FOR CONSOLE
// ========================================

// Make functions available globally for easy access
const performanceAnalysis = {
  quickCheck,
  analyzeComponent,
  compareAnalysisComponent,
  runPerformanceTests,
  checkMemoryLeaks,
  detectRegressions,
  generateFullReport,
};

// Setup global access for browser console
if (typeof window !== 'undefined') {
  window.performanceAnalysis = performanceAnalysis;
}

// Display usage instructions
console.log(`
🚀 PERFORMANCE ANALYSIS TOOLS LOADED!
=====================================

Quick Commands:
- performanceAnalysis.quickCheck()                 // Get overview
- performanceAnalysis.analyzeComponent('Analysis') // Analyze specific component
- performanceAnalysis.compareAnalysisComponent()   // Example comparison
- performanceAnalysis.runPerformanceTests()        // Run full test suite
- performanceAnalysis.checkMemoryLeaks()           // Check for memory leaks
- performanceAnalysis.detectRegressions()          // Find regressions
- performanceAnalysis.generateFullReport()         // Complete analysis

Example Usage:
=============
// Quick performance check
performanceAnalysis.quickCheck();

// Analyze specific component
performanceAnalysis.analyzeComponent('Analysis');

// Generate comprehensive report
performanceAnalysis.generateFullReport();
`);

// Export for use in other files
export default performanceAnalysis;
export {
  quickCheck,
  analyzeComponent,
  compareAnalysisComponent,
  runPerformanceTests,
  checkMemoryLeaks,
  detectRegressions,
  generateFullReport
};
