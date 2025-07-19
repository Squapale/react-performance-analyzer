// Performance monitoring utilities
import React from 'react';

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      componentRenderTimes: new Map(),
      bundleLoadTimes: new Map(),
      memoryUsage: [],
      slowComponents: new Set(),
    };
    
    this.thresholds = {
      slowRender: 16, // 16ms for 60fps
      slowLoad: 1000, // 1 second
      memoryLimit: 50 * 1024 * 1024, // 50MB
    };
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
      }
      
      startTimeRef.current = null;
      return duration;
    }
    return 0;
  }, []);
  
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
