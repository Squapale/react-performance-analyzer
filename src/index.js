// Performance Analyzer Library - Main Entry Point
// A comprehensive performance analysis library for React applications

// Core exports
export * from './core/index.js';
export { default as performanceComparator } from './core/performanceComparator.js';

// Component exports
export * from './components/index.js';

// Testing utilities
export * from './testing/index.js';

// Analysis utilities
export * from './utils/index.js';

// Convenience exports for common usage patterns
export { 
  usePerformanceMonitoring, 
  PerformanceMonitor,
  performanceMonitor,
  initializePerformanceMonitoring,
  performanceLogger,
  PerformanceContext,
  PerformanceProvider
} from './core/performanceMonitoring.js';

export { 
  PerformanceDashboard,
  PerformanceToggle 
} from './components/index.js';

export { 
  PerformanceTestSuite 
} from './testing/index.js';

export { 
  performanceAnalysis 
} from './utils/index.js';

// Default export - commonly used functionality
export default {
  // Core monitoring
  usePerformanceMonitoring: require('./core/performanceMonitoring.js').usePerformanceMonitoring,
  PerformanceMonitor: require('./core/performanceMonitoring.js').PerformanceMonitor,
  initializePerformanceMonitoring: require('./core/performanceMonitoring.js').initializePerformanceMonitoring,
  
  // Components
  PerformanceDashboard: require('./components/PerformanceDashboard.js').default,
  PerformanceToggle: require('./components/PerformanceToggle.js').default,
  
  // Testing
  PerformanceTestSuite: require('./testing/performanceTestSuite.js').default,
  
  // Analysis
  performanceAnalysis: require('./utils/performanceAnalysisExamples.js').default,
  
  // Comparator
  performanceComparator: require('./core/performanceComparator.js').default,
};
