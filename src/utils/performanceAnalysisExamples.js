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
// 8. PERFORMANCE BUDGET MONITORING
// ========================================

// Set performance budgets
const setPerformanceBudgets = (budgets = {}) => {
  console.log('💰 SETTING PERFORMANCE BUDGETS');
  console.log('==============================');
  
  const defaultBudgets = {
    renderTime: 16, // ms per component
    totalRenderTime: 100, // ms per frame
    memoryUsage: 50 * 1024 * 1024, // 50MB
    componentCount: 100, // max components
    reRendersPerSecond: 30 // max re-renders per component per second
  };
  
  const finalBudgets = { ...defaultBudgets, ...budgets };
  
  Object.entries(finalBudgets).forEach(([type, value]) => {
    window.performanceMonitor.setPerformanceBudget(type, value);
  });
  
  console.log('📊 Budgets set:', finalBudgets);
  return finalBudgets;
};

// Check current budget status
const checkBudgetStatus = () => {
  console.log('💰 BUDGET STATUS CHECK');
  console.log('=====================');
  
  const violations = window.performanceMonitor.checkPerformanceBudgets();
  
  if (violations.length === 0) {
    console.log('✅ All performance budgets are within limits');
  } else {
    console.log(`⚠️ Found ${violations.length} budget violations:`);
    violations.forEach(violation => {
      const severity = violation.severity === 'critical' ? '🚨' : violation.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`  ${severity} ${violation.message}`);
    });
  }
  
  return violations;
};

// ========================================
// 9. COMPONENT DEPENDENCY ANALYSIS
// ========================================

// Analyze component dependencies and bottlenecks
const analyzeDependencies = (componentName = null) => {
  console.log('🔗 COMPONENT DEPENDENCY ANALYSIS');
  console.log('=================================');
  
  if (componentName) {
    // Analyze specific component
    const deps = window.performanceMonitor.getComponentDependencies(componentName);
    console.log(`📋 Analysis for: ${componentName}`);
    console.log('  Dependencies (children):', deps.dependencies);
    console.log('  Dependents (parents):', deps.dependents);
    console.log('  Render history count:', deps.renderHistory.length);
    
    if (deps.renderHistory.length > 0) {
      const recent = deps.renderHistory.slice(-5);
      console.log('  Recent renders:', recent.map(h => `${h.renderTime.toFixed(2)}ms`).join(', '));
    }
    
    return deps;
  } else {
    // Analyze all bottlenecks
    const bottlenecks = window.performanceMonitor.analyzeComponentBottlenecks();
    
    if (bottlenecks.length === 0) {
      console.log('✅ No performance bottlenecks detected');
    } else {
      console.log(`⚠️ Found ${bottlenecks.length} performance bottlenecks:`);
      bottlenecks.forEach(bottleneck => {
        console.log(`\n🔴 ${bottleneck.componentName}:`);
        console.log(`   Avg render time: ${bottleneck.avgRenderTime.toFixed(2)}ms`);
        console.log(`   Render frequency: ${bottleneck.renderFrequency.toFixed(1)}/sec`);
        console.log(`   Dependencies: ${bottleneck.dependencyCount}`);
        console.log(`   Issues: ${bottleneck.issues.join(', ')}`);
        console.log(`   Recommendations: ${bottleneck.recommendations.join(', ')}`);
      });
    }
    
    return bottlenecks;
  }
};

// ========================================
// 10. PERFORMANCE PROFILING SESSIONS
// ========================================

// Start a performance profiling session
const startProfilingSession = (sessionName = 'user-session') => {
  console.log('🔍 STARTING PERFORMANCE PROFILING SESSION');
  console.log('==========================================');
  
  const session = window.performanceMonitor.startProfilingSession(sessionName);
  
  console.log(`📊 Session "${sessionName}" started`);
  console.log('💡 Navigate through your app to collect performance data');
  console.log('💡 Call endProfilingSession() when done');
  
  return session;
};

// Take a manual snapshot during profiling
const takeSnapshot = (label = 'manual-snapshot') => {
  console.log(`📸 Taking snapshot: ${label}`);
  
  const snapshot = window.performanceMonitor.takePerformanceSnapshot(label);
  
  console.log('Snapshot data:', {
    label: snapshot.label,
    timestamp: new Date(snapshot.timestamp).toLocaleTimeString(),
    memory: `${(snapshot.memory / 1024 / 1024).toFixed(2)}MB`,
    componentCount: snapshot.componentCount,
    budgetViolations: snapshot.budgetViolations.length
  });
  
  return snapshot;
};

// End profiling session and generate report
const endProfilingSession = () => {
  console.log('🏁 ENDING PERFORMANCE PROFILING SESSION');
  console.log('=======================================');
  
  const report = window.performanceMonitor.endProfilingSession();
  
  if (!report) {
    console.log('❌ No active profiling session found');
    return null;
  }
  
  console.log('📊 SESSION REPORT:');
  console.log(`   Duration: ${(report.session.duration / 1000).toFixed(2)}s`);
  console.log(`   Memory delta: ${(report.session.memoryDelta / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   New components: ${report.analysis.newComponents}`);
  console.log(`   Bottlenecks found: ${report.analysis.bottlenecks.length}`);
  console.log(`   Budget violations: ${report.analysis.budgetViolations}`);
  
  if (report.analysis.bottlenecks.length > 0) {
    console.log('\n🔴 TOP BOTTLENECKS:');
    report.analysis.bottlenecks.slice(0, 3).forEach((bottleneck, i) => {
      console.log(`   ${i + 1}. ${bottleneck.componentName}: ${bottleneck.avgRenderTime.toFixed(2)}ms`);
    });
  }
  
  // Export session report
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `profiling-session-${report.session.name}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('📥 Session report exported to download');
  
  return report;
};

// ========================================
// 11. ADVANCED PERFORMANCE DIAGNOSTICS
// ========================================

// Run comprehensive performance diagnostics
const runPerformanceDiagnostics = () => {
  console.log('🔬 COMPREHENSIVE PERFORMANCE DIAGNOSTICS');
  console.log('========================================');
  
  // 1. Budget check
  console.log('\n💰 1. Budget Status:');
  const budgetViolations = checkBudgetStatus();
  
  // 2. Dependency analysis
  console.log('\n🔗 2. Dependency Analysis:');
  const bottlenecks = analyzeDependencies();
  
  // 3. Memory analysis
  console.log('\n🧠 3. Memory Analysis:');
  const memoryLeaks = checkMemoryLeaks();
  
  // 4. General performance
  console.log('\n📊 4. General Performance:');
  const generalData = quickCheck();
  
  // Generate diagnostic score
  let score = 100;
  
  // Deduct for budget violations
  budgetViolations.forEach(violation => {
    if (violation.severity === 'critical') score -= 20;
    else if (violation.severity === 'warning') score -= 10;
    else score -= 5;
  });
  
  // Deduct for bottlenecks
  score -= bottlenecks.length * 15;
  
  // Deduct for memory leaks
  if (memoryLeaks) score -= 25;
  
  score = Math.max(0, score);
  
  console.log('\n🎯 DIAGNOSTIC SCORE:', score + '/100');
  
  if (score >= 90) console.log('🎉 Excellent performance!');
  else if (score >= 70) console.log('👍 Good performance');
  else if (score >= 50) console.log('⚠️ Needs optimization');
  else console.log('❌ Poor performance - immediate action needed');
  
  return {
    score,
    budgetViolations,
    bottlenecks,
    memoryLeaks,
    generalData
  };
};

// ========================================
// ENHANCED QUICK COMMANDS
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
  // New enhanced features
  setPerformanceBudgets,
  checkBudgetStatus,
  analyzeDependencies,
  startProfilingSession,
  takeSnapshot,
  endProfilingSession,
  runPerformanceDiagnostics
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

🆕 New Enhanced Features:
- performanceAnalysis.setPerformanceBudgets({})    // Set performance budgets
- performanceAnalysis.checkBudgetStatus()          // Check budget violations
- performanceAnalysis.analyzeDependencies()        // Component dependency analysis
- performanceAnalysis.startProfilingSession()      // Start profiling session
- performanceAnalysis.takeSnapshot('label')        // Take performance snapshot
- performanceAnalysis.endProfilingSession()        // End session & get report
- performanceAnalysis.runPerformanceDiagnostics()  // Comprehensive diagnostics

Example Usage:
=============
// Quick performance check
performanceAnalysis.quickCheck();

// Set performance budgets
performanceAnalysis.setPerformanceBudgets({
  renderTime: 16,      // 16ms per component
  memoryUsage: 50MB,   // 50MB max memory
  componentCount: 100  // max 100 components
});

// Check budget status
performanceAnalysis.checkBudgetStatus();

// Start profiling session
performanceAnalysis.startProfilingSession('feature-test');
// ... navigate and use your app ...
performanceAnalysis.endProfilingSession();

// Run comprehensive diagnostics
performanceAnalysis.runPerformanceDiagnostics();
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
  generateFullReport,
  setPerformanceBudgets,
  checkBudgetStatus,
  analyzeDependencies,
  startProfilingSession,
  takeSnapshot,
  endProfilingSession,
  runPerformanceDiagnostics
};
