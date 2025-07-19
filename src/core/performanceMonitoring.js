// Performance monitoring utilities
import React from 'react';

// Performance Context for component hierarchy tracking
export const PerformanceContext = React.createContext({
  parentComponent: null,
  profilingSession: null
});

// Performance Provider Component
export const PerformanceProvider = ({ children, componentName, profilingSession }) => {
  const contextValue = React.useMemo(() => ({
    parentComponent: componentName,
    profilingSession
  }), [componentName, profilingSession]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      componentRenderTimes: new Map(),
      bundleLoadTimes: new Map(),
      memoryUsage: [],
      slowComponents: new Set(),
      componentDependencies: new Map(), // New: track component relationships
      renderHistory: new Map(), // New: track render history per component
    };
    
    this.thresholds = {
      slowRender: 16, // 16ms for 60fps
      slowLoad: 1000, // 1 second
      memoryLimit: 50 * 1024 * 1024, // 50MB
    };

    // New: Performance budgets
    this.performanceBudgets = {
      renderTime: 16, // ms per component
      totalRenderTime: 100, // ms per frame
      memoryUsage: 50 * 1024 * 1024, // 50MB
      bundleSize: 2 * 1024 * 1024, // 2MB
      componentCount: 100, // max components per page
      reRendersPerSecond: 30, // max re-renders per component per second
    };

    // New: Budget violations tracking
    this.budgetViolations = [];
    this.dependencyGraph = new Map(); // Component dependency graph
  }

  // Monitor component render performance
  measureComponentRender(componentName, renderFn) {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    this.metrics.componentRenderTimes.set(componentName, renderTime);
    
    if (renderTime > this.thresholds.slowRender) {
      this.metrics.slowComponents.add(componentName);
      console.warn(`Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
    
    return result;
  }

  // Monitor bundle load performance
  measureBundleLoad(bundleName, loadPromise) {
    const startTime = performance.now();
    
    return loadPromise.then((result) => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.metrics.bundleLoadTimes.set(bundleName, loadTime);
      
      if (loadTime > this.thresholds.slowLoad) {
        console.warn(`Slow bundle load: ${bundleName} took ${loadTime.toFixed(2)}ms`);
      }
      
      return result;
    });
  }

  // Monitor memory usage
  measureMemoryUsage() {
    if (performance.memory) {
      const usage = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      };
      
      this.metrics.memoryUsage.push(usage);
      
      // Keep only last 100 measurements
      if (this.metrics.memoryUsage.length > 100) {
        this.metrics.memoryUsage.shift();
      }
      
      if (usage.used > this.thresholds.memoryLimit) {
        console.warn(`High memory usage: ${(usage.used / 1024 / 1024).toFixed(2)}MB`);
      }
      
      return usage;
    }
    
    return null;
  }

  // Generate performance report
  generateReport() {
    const report = {
      renderTimes: Object.fromEntries(this.metrics.componentRenderTimes),
      loadTimes: Object.fromEntries(this.metrics.bundleLoadTimes),
      slowComponents: Array.from(this.metrics.slowComponents),
      averageMemoryUsage: this.getAverageMemoryUsage(),
      recommendations: this.generateRecommendations(),
    };
    
    return report;
  }

  // Get average memory usage
  getAverageMemoryUsage() {
    if (this.metrics.memoryUsage.length === 0) return null;
    
    const total = this.metrics.memoryUsage.reduce((sum, usage) => sum + usage.used, 0);
    return total / this.metrics.memoryUsage.length;
  }

  // Generate optimization recommendations
  generateRecommendations() {
    const recommendations = [];
    
    // Check for slow components
    if (this.metrics.slowComponents.size > 0) {
      recommendations.push({
        type: 'slow_components',
        message: `Consider optimizing these slow components: ${Array.from(this.metrics.slowComponents).join(', ')}`,
        components: Array.from(this.metrics.slowComponents),
      });
    }
    
    // Check for slow bundle loads
    const slowBundles = Array.from(this.metrics.bundleLoadTimes.entries())
      .filter(([_, time]) => time > this.thresholds.slowLoad)
      .map(([name]) => name);
    
    if (slowBundles.length > 0) {
      recommendations.push({
        type: 'slow_bundles',
        message: `Consider optimizing these slow loading bundles: ${slowBundles.join(', ')}`,
        bundles: slowBundles,
      });
    }
    
    // Check memory usage
    const avgMemory = this.getAverageMemoryUsage();
    if (avgMemory && avgMemory > this.thresholds.memoryLimit) {
      recommendations.push({
        type: 'high_memory',
        message: `High memory usage detected: ${(avgMemory / 1024 / 1024).toFixed(2)}MB`,
        usage: avgMemory,
      });
    }
    
    return recommendations;
  }

  // New: Performance Budget Management
  setPerformanceBudget(budgetType, value) {
    if (Object.prototype.hasOwnProperty.call(this.performanceBudgets, budgetType)) {
      this.performanceBudgets[budgetType] = value;
      console.log(`📊 Performance budget set: ${budgetType} = ${value}`);
    } else {
      console.warn(`⚠️ Unknown budget type: ${budgetType}`);
    }
  }

  checkPerformanceBudgets() {
    const violations = [];
    const now = Date.now();

    // Check render time budget
    const recentRenders = Array.from(this.metrics.componentRenderTimes.values());
    const avgRenderTime = recentRenders.length > 0 
      ? recentRenders.reduce((sum, time) => sum + time, 0) / recentRenders.length 
      : 0;

    if (avgRenderTime > this.performanceBudgets.renderTime) {
      violations.push({
        type: 'renderTime',
        budget: this.performanceBudgets.renderTime,
        actual: avgRenderTime,
        severity: avgRenderTime > this.performanceBudgets.renderTime * 2 ? 'critical' : 'warning',
        message: `Average render time ${avgRenderTime.toFixed(2)}ms exceeds budget of ${this.performanceBudgets.renderTime}ms`
      });
    }

    // Check total render time per frame
    const totalRenderTime = recentRenders.reduce((sum, time) => sum + time, 0);
    if (totalRenderTime > this.performanceBudgets.totalRenderTime) {
      violations.push({
        type: 'totalRenderTime',
        budget: this.performanceBudgets.totalRenderTime,
        actual: totalRenderTime,
        severity: 'warning',
        message: `Total render time ${totalRenderTime.toFixed(2)}ms exceeds budget of ${this.performanceBudgets.totalRenderTime}ms`
      });
    }

    // Check memory budget
    const currentMemory = this.metrics.memoryUsage.length > 0 
      ? this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1].used 
      : 0;
    if (currentMemory > this.performanceBudgets.memoryUsage) {
      violations.push({
        type: 'memoryUsage',
        budget: this.performanceBudgets.memoryUsage,
        actual: currentMemory,
        severity: currentMemory > this.performanceBudgets.memoryUsage * 1.5 ? 'critical' : 'warning',
        message: `Memory usage ${(currentMemory / 1024 / 1024).toFixed(2)}MB exceeds budget of ${(this.performanceBudgets.memoryUsage / 1024 / 1024).toFixed(2)}MB`
      });
    }

    // Check component count budget
    const componentCount = this.metrics.componentRenderTimes.size;
    if (componentCount > this.performanceBudgets.componentCount) {
      violations.push({
        type: 'componentCount',
        budget: this.performanceBudgets.componentCount,
        actual: componentCount,
        severity: 'info',
        message: `Component count ${componentCount} exceeds budget of ${this.performanceBudgets.componentCount}`
      });
    }

    // Store violations with timestamp
    if (violations.length > 0) {
      this.budgetViolations.push({
        timestamp: now,
        violations
      });

      // Keep only last 50 violation records
      if (this.budgetViolations.length > 50) {
        this.budgetViolations.shift();
      }

      // Log violations
      violations.forEach(violation => {
        const emoji = violation.severity === 'critical' ? '🚨' : violation.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.warn(`${emoji} Budget violation: ${violation.message}`);
      });
    }

    return violations;
  }

  // New: Component Dependency Tracking
  trackComponentDependency(parentComponent, childComponent, renderTime) {
    if (!this.dependencyGraph.has(parentComponent)) {
      this.dependencyGraph.set(parentComponent, new Set());
    }
    this.dependencyGraph.get(parentComponent).add(childComponent);

    // Track render history
    if (!this.metrics.renderHistory.has(childComponent)) {
      this.metrics.renderHistory.set(childComponent, []);
    }

    const history = this.metrics.renderHistory.get(childComponent);
    history.push({
      timestamp: Date.now(),
      renderTime,
      parentComponent,
      context: 'dependency'
    });

    // Keep only last 100 renders per component
    if (history.length > 100) {
      history.shift();
    }
  }

  getComponentDependencies(componentName) {
    const dependencies = this.dependencyGraph.get(componentName) || new Set();
    const dependents = [];

    // Find components that depend on this one
    for (const [parent, children] of this.dependencyGraph.entries()) {
      if (children.has(componentName)) {
        dependents.push(parent);
      }
    }

    return {
      dependencies: Array.from(dependencies),
      dependents,
      renderHistory: this.metrics.renderHistory.get(componentName) || []
    };
  }

  analyzeComponentBottlenecks() {
    const bottlenecks = [];

    for (const [componentName, renderTime] of this.metrics.componentRenderTimes.entries()) {
      const dependencies = this.getComponentDependencies(componentName);
      const history = dependencies.renderHistory;

      if (history.length < 5) continue; // Need sufficient data

      // Calculate render frequency
      const recentHistory = history.slice(-10);
      const timeSpan = recentHistory[recentHistory.length - 1].timestamp - recentHistory[0].timestamp;
      const renderFrequency = recentHistory.length / (timeSpan / 1000); // renders per second

      // Calculate average render time
      const avgRenderTime = recentHistory.reduce((sum, h) => sum + h.renderTime, 0) / recentHistory.length;

      // Identify bottlenecks
      const isBottleneck = (
        avgRenderTime > this.performanceBudgets.renderTime ||
        renderFrequency > this.performanceBudgets.reRendersPerSecond ||
        dependencies.dependencies.length > 10 // too many child components
      );

      if (isBottleneck) {
        bottlenecks.push({
          componentName,
          avgRenderTime,
          renderFrequency,
          dependencyCount: dependencies.dependencies.length,
          dependentCount: dependencies.dependents.length,
          issues: [],
          recommendations: []
        });

        const bottleneck = bottlenecks[bottlenecks.length - 1];

        // Identify specific issues
        if (avgRenderTime > this.performanceBudgets.renderTime) {
          bottleneck.issues.push(`Slow render time: ${avgRenderTime.toFixed(2)}ms`);
          bottleneck.recommendations.push('Consider memoization with React.memo()');
        }

        if (renderFrequency > this.performanceBudgets.reRendersPerSecond) {
          bottleneck.issues.push(`High re-render frequency: ${renderFrequency.toFixed(1)}/sec`);
          bottleneck.recommendations.push('Check for unnecessary prop changes or state updates');
        }

        if (dependencies.dependencies.length > 10) {
          bottleneck.issues.push(`Too many child components: ${dependencies.dependencies.length}`);
          bottleneck.recommendations.push('Consider component composition or virtualization');
        }
      }
    }

    return bottlenecks.sort((a, b) => b.avgRenderTime - a.avgRenderTime);
  }

  // New: Performance Profiling Session
  startProfilingSession(sessionName = 'default') {
    const session = {
      name: sessionName,
      startTime: Date.now(),
      startMemory: performance.memory ? performance.memory.usedJSHeapSize : 0,
      initialComponentCount: this.metrics.componentRenderTimes.size,
      snapshots: []
    };

    // Take initial snapshot
    session.snapshots.push(this.takePerformanceSnapshot('session-start'));

    this.currentSession = session;
    console.log(`🔍 Performance profiling session '${sessionName}' started`);

    return session;
  }

  takePerformanceSnapshot(label = 'snapshot') {
    return {
      label,
      timestamp: Date.now(),
      memory: performance.memory ? performance.memory.usedJSHeapSize : 0,
      componentCount: this.metrics.componentRenderTimes.size,
      renderTimes: Object.fromEntries(this.metrics.componentRenderTimes),
      budgetViolations: this.checkPerformanceBudgets()
    };
  }

  endProfilingSession() {
    if (!this.currentSession) {
      console.warn('⚠️ No active profiling session');
      return null;
    }

    const session = this.currentSession;
    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
    session.endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
    session.memoryDelta = session.endMemory - session.startMemory;

    // Take final snapshot
    session.snapshots.push(this.takePerformanceSnapshot('session-end'));

    // Generate session report
    const report = {
      session,
      analysis: {
        duration: session.duration,
        memoryDelta: session.memoryDelta,
        newComponents: session.snapshots[session.snapshots.length - 1].componentCount - session.initialComponentCount,
        bottlenecks: this.analyzeComponentBottlenecks(),
        budgetViolations: session.snapshots.reduce((total, snapshot) => 
          total + snapshot.budgetViolations.length, 0)
      }
    };

    this.currentSession = null;
    console.log(`✅ Performance profiling session '${session.name}' completed`, report);

    return report;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hooks for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      performanceMonitor.metrics.componentRenderTimes.set(componentName, renderTime);
    };
  }, [componentName]);
};

// Enhanced performance monitoring hook
export const usePerformanceMonitoring = (componentName) => {
  const [metrics, setMetrics] = React.useState({});
  const startTimeRef = React.useRef(null);
  
  const startTiming = React.useCallback((operationName) => {
    startTimeRef.current = performance.now();
    return operationName;
  }, []);
  
  const endTiming = React.useCallback((operationName) => {
    if (startTimeRef.current) {
      const endTime = performance.now();
      const duration = endTime - startTimeRef.current;
      
      setMetrics(prev => ({
        ...prev,
        [operationName]: duration
      }));
      
      // Record to global monitor
      if (typeof window !== 'undefined' && window.performanceMonitor) {
        window.performanceMonitor.recordRender(operationName, duration);
        
        // Check performance budgets
        window.performanceMonitor.checkPerformanceBudgets();
        
        // Track component dependency if parent component is known
        // Note: This would need to be moved inside the component hook if needed
      }
      
      startTimeRef.current = null;
      return duration;
    }
    return 0;
  }, [componentName]);

  const getBudgetStatus = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.performanceMonitor) {
      return window.performanceMonitor.checkPerformanceBudgets();
    }
    return [];
  }, []);

  const getDependencies = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.performanceMonitor) {
      return window.performanceMonitor.getComponentDependencies(componentName);
    }
    return { dependencies: [], dependents: [], renderHistory: [] };
  }, [componentName]);

  const isBottleneck = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.performanceMonitor) {
      const bottlenecks = window.performanceMonitor.analyzeComponentBottlenecks();
      return bottlenecks.find(b => b.componentName === componentName) || null;
    }
    return null;
  }, [componentName]);
  
  const getMetrics = React.useCallback(() => {
    return metrics;
  }, [metrics]);
  
  // Monitor component lifecycle
  React.useEffect(() => {
    const mountTime = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      const lifeTime = unmountTime - mountTime;
      
      if (typeof window !== 'undefined' && window.performanceMonitor) {
        window.performanceMonitor.recordRender(`${componentName}-lifecycle`, lifeTime);
      }
    };
  }, [componentName]);
  
  return {
    startTiming,
    endTiming,
    getMetrics,
    getBudgetStatus,
    getDependencies,
    isBottleneck,
    metrics
  };
};

// HOC for performance monitoring
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  const PerformanceMonitoredComponent = React.memo((props) => {
    const renderStartTime = React.useRef(performance.now());
    
    React.useEffect(() => {
      const renderTime = performance.now() - renderStartTime.current;
      performanceMonitor.metrics.componentRenderTimes.set(componentName, renderTime);
      
      if (renderTime > performanceMonitor.thresholds.slowRender) {
        performanceMonitor.metrics.slowComponents.add(componentName);
      }
    });
    
    renderStartTime.current = performance.now();
    
    return <WrappedComponent {...props} />;
  });
  
  PerformanceMonitoredComponent.displayName = `withPerformanceMonitoring(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return PerformanceMonitoredComponent;
};

// Bundle analysis utilities
export const analyzeBundleSize = async () => {
  if (typeof window !== 'undefined' && window.performance) {
    const entries = performance.getEntriesByType('resource');
    const jsFiles = entries.filter(entry => entry.name.endsWith('.js'));
    
    const analysis = jsFiles.map(file => ({
      name: file.name.split('/').pop(),
      size: file.transferSize,
      loadTime: file.duration,
      cached: file.transferSize === 0,
    }));
    
    return analysis.sort((a, b) => b.size - a.size);
  }
  
  return [];
};

// Memory leak detection
export const detectMemoryLeaks = () => {
  const measurements = [];
  let intervalId;
  
  const measure = () => {
    const usage = performanceMonitor.measureMemoryUsage();
    if (usage) {
      measurements.push(usage);
      
      // Check for memory leaks (continuous growth)
      if (measurements.length > 10) {
        const recent = measurements.slice(-10);
        const trend = recent.reduce((sum, curr, idx) => {
          if (idx === 0) return sum;
          return sum + (curr.used - recent[idx - 1].used);
        }, 0);
        
        if (trend > 5 * 1024 * 1024) { // 5MB growth
          console.warn('Potential memory leak detected - consistent growth pattern');
        }
      }
    }
  };
  
  // Start monitoring
  intervalId = setInterval(measure, 5000); // Every 5 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    return measurements;
  };
};

// Performance optimization suggestions
export const getOptimizationSuggestions = (component) => {
  const suggestions = [];
  
  // Check if component is slow
  const renderTime = performanceMonitor.metrics.componentRenderTimes.get(component);
  if (renderTime > 16) {
    suggestions.push({
      type: 'memoization',
      message: 'Consider using React.memo or useMemo for expensive computations',
      priority: 'high',
    });
  }
  
  // Check for potential prop drilling
  if (component.includes('deep') || component.includes('nested')) {
    suggestions.push({
      type: 'context',
      message: 'Consider using React Context or state management library',
      priority: 'medium',
    });
  }
  
  // Check for list rendering
  if (component.includes('List') || component.includes('Table')) {
    suggestions.push({
      type: 'virtualization',
      message: 'Consider using virtualization for large lists',
      priority: 'high',
    });
  }
  
  return suggestions;
};

// Development tools integration
export const enableDevtools = () => {
  if (process.env.NODE_ENV === 'development') {
    // Add performance monitoring to window for debugging
    window.performanceMonitor = performanceMonitor;
    
    // Add console commands
    window.getPerformanceReport = () => {
      console.table(performanceMonitor.generateReport());
    };
    
    window.analyzeBundles = async () => {
      const analysis = await analyzeBundleSize();
      console.table(analysis);
    };
    
    // Start memory monitoring
    const stopMemoryMonitoring = detectMemoryLeaks();
    window.stopMemoryMonitoring = stopMemoryMonitoring;
  }
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = (config = {}) => {
  if (typeof window === 'undefined') return;
  
  // Apply configuration
  if (config.thresholds) {
    Object.assign(performanceMonitor.thresholds, config.thresholds);
  }
  
  // Store configuration
  const monitoringConfig = {
    enabled: config.monitoring?.enabled ?? true,
    interval: config.monitoring?.interval ?? 5000,
    store: config.store || null,
    ...config
  };
  
  // Enable development tools
  enableDevtools();
  
  // Start memory monitoring if enabled
  if (monitoringConfig.enabled) {
    const stopMemoryMonitoring = detectMemoryLeaks();
    
    // Enhanced performance monitoring
    const performanceData = {
      renderTimes: [],
      memoryUsage: [],
      componentMetrics: {},
      bundleAnalysis: {},
      isMonitoring: true,
    };
    
    // Global performance monitor with enhanced API
    window.performanceMonitor = {
      ...performanceMonitor,
      
      // Get comprehensive performance data
      getPerformanceData: () => {
        const metrics = performanceMonitor.generateReport();
        return {
          renderTimes: Array.from(performanceMonitor.metrics.componentRenderTimes.values()),
          memoryUsage: performanceMonitor.metrics.memoryUsage.map(m => m.used),
          componentMetrics: Object.fromEntries(
            Array.from(performanceMonitor.metrics.componentRenderTimes.entries()).map(([name, time]) => [
              name,
              {
                renderCount: 1,
                averageRenderTime: time,
                maxRenderTime: time,
              }
            ])
          ),
          bundleAnalysis: Object.fromEntries(performanceMonitor.metrics.bundleLoadTimes),
          slowComponents: Array.from(performanceMonitor.metrics.slowComponents),
          ...performanceData,
        };
      },
      
      // Record render time
      recordRender: (componentName, renderTime) => {
        performanceMonitor.metrics.componentRenderTimes.set(componentName, renderTime);
        performanceData.renderTimes.push(renderTime);
        
        // Update component metrics
        if (!performanceData.componentMetrics[componentName]) {
          performanceData.componentMetrics[componentName] = {
            renderCount: 0,
            totalRenderTime: 0,
            maxRenderTime: 0,
          };
        }
        
        const metrics = performanceData.componentMetrics[componentName];
        metrics.renderCount++;
        metrics.totalRenderTime += renderTime;
        metrics.maxRenderTime = Math.max(metrics.maxRenderTime, renderTime);
        metrics.averageRenderTime = metrics.totalRenderTime / metrics.renderCount;
      },
      
      // Record memory usage
      recordMemory: (memoryUsage) => {
        performanceData.memoryUsage.push(memoryUsage);
        if (performanceData.memoryUsage.length > 100) {
          performanceData.memoryUsage.shift();
        }
      },
      
      // Control monitoring
      startMonitoring: () => {
        performanceData.isMonitoring = true;
      },
      
      stopMonitoring: () => {
        performanceData.isMonitoring = false;
        if (stopMemoryMonitoring) {
          stopMemoryMonitoring();
        }
      },
      
      // Clear data
      clearData: () => {
        performanceData.renderTimes = [];
        performanceData.memoryUsage = [];
        performanceData.componentMetrics = {};
        performanceMonitor.metrics.componentRenderTimes.clear();
        performanceMonitor.metrics.bundleLoadTimes.clear();
        performanceMonitor.metrics.slowComponents.clear();
        performanceMonitor.metrics.memoryUsage = [];
      },
    };
    
    // Enhanced console commands
    window.getPerformanceReport = () => {
      const data = window.performanceMonitor.getPerformanceData();
      console.group('📊 Performance Report');
      console.log('Render Times:', data.renderTimes);
      console.log('Memory Usage:', data.memoryUsage.map(m => (m / 1024 / 1024).toFixed(2) + 'MB'));
      console.log('Component Metrics:', data.componentMetrics);
      console.log('Slow Components:', data.slowComponents);
      console.groupEnd();
      return data;
    };
    
    // Start periodic memory monitoring
    const memoryInterval = setInterval(() => {
      if (performanceData.isMonitoring) {
        const usage = performanceMonitor.measureMemoryUsage();
        if (usage) {
          performanceData.memoryUsage.push(usage.used);
          if (performanceData.memoryUsage.length > 100) {
            performanceData.memoryUsage.shift();
          }
        }
      }
    }, monitoringConfig.interval);
    
    // Cleanup function
    window.stopMemoryMonitoring = () => {
      clearInterval(memoryInterval);
      stopMemoryMonitoring();
    };
  }
  
  console.log('🚀 Performance monitoring initialized with config:', monitoringConfig);
  
  return {
    monitor: window.performanceMonitor,
    config: monitoringConfig,
  };
};

if (typeof window !== 'undefined') {
  enableDevtools();
}

// Performance Logger - Utility for logging performance-related information
export const performanceLogger = {
  info: (message, data = null) => {
    console.log(`🔍 [Performance Info]: ${message}`, data ? data : '');
  },
  
  warn: (message, data = null) => {
    console.warn(`⚠️ [Performance Warning]: ${message}`, data ? data : '');
  },
  
  error: (message, data = null) => {
    console.error(`❌ [Performance Error]: ${message}`, data ? data : '');
  },
  
  timing: (label, startTime, endTime = performance.now()) => {
    const duration = endTime - startTime;
    console.log(`⏱️ [Performance Timing] ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  },
  
  memory: () => {
    if (performance.memory) {
      const memory = {
        used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
        total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB',
        limit: (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB'
      };
      console.log('💾 [Memory Usage]:', memory);
      return memory;
    } else {
      console.warn('⚠️ Memory measurement not available in this environment');
      return null;
    }
  },
  
  table: (data, label = 'Performance Data') => {
    console.group(`📊 ${label}`);
    console.table(data);
    console.groupEnd();
  }
};
