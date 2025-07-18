// Performance Comparison and Analysis Tool
// This utility helps compare performance before and after optimizations

class PerformanceComparator {
  constructor() {
    this.baselines = new Map();
    this.currentMetrics = new Map();
    this.comparisonResults = [];
  }

  // Set baseline performance metrics (before optimization)
  setBaseline(componentName, metrics) {
    this.baselines.set(componentName, {
      ...metrics,
      timestamp: Date.now(),
    });
    console.log(`📊 Baseline set for ${componentName}:`, metrics);
  }

  // Record current performance metrics (after optimization)
  recordCurrent(componentName, metrics) {
    this.currentMetrics.set(componentName, {
      ...metrics,
      timestamp: Date.now(),
    });
    console.log(`📈 Current metrics recorded for ${componentName}:`, metrics);
  }

  // Compare performance between baseline and current
  comparePerformance(componentName) {
    const baseline = this.baselines.get(componentName);
    const current = this.currentMetrics.get(componentName);

    if (!baseline || !current) {
      console.warn(`❌ Missing data for ${componentName}. Need both baseline and current metrics.`);
      return null;
    }

    const comparison = {
      componentName,
      baseline,
      current,
      improvements: {},
      regressions: {},
      summary: {},
    };

    // Calculate improvements/regressions
    const metrics = ['renderTime', 'memoryUsage', 'bundleSize', 'loadTime'];
    
    metrics.forEach(metric => {
      if (baseline[metric] !== undefined && current[metric] !== undefined) {
        const baseValue = baseline[metric];
        const currentValue = current[metric];
        const difference = currentValue - baseValue;
        const percentChange = ((currentValue - baseValue) / baseValue) * 100;
        
        comparison.summary[metric] = {
          baseline: baseValue,
          current: currentValue,
          difference,
          percentChange,
          improved: difference < 0,
        };

        if (difference < 0) {
          comparison.improvements[metric] = Math.abs(percentChange);
        } else if (difference > 0) {
          comparison.regressions[metric] = percentChange;
        }
      }
    });

    this.comparisonResults.push(comparison);
    return comparison;
  }

  // Generate comprehensive performance report
  generateComparisonReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalComponents: this.comparisonResults.length,
      overallImprovements: {},
      overallRegressions: {},
      recommendations: [],
      summary: {
        avgRenderTimeImprovement: 0,
        avgMemoryImprovement: 0,
        avgBundleSizeImprovement: 0,
        totalImprovements: 0,
        totalRegressions: 0,
      },
    };

    // Calculate overall improvements
    let totalRenderTimeImprovement = 0;
    let totalMemoryImprovement = 0;
    let totalBundleSizeImprovement = 0;
    let componentsWithRenderImprovement = 0;
    let componentsWithMemoryImprovement = 0;
    let componentsWithBundleImprovement = 0;

    this.comparisonResults.forEach(result => {
      if (result.improvements.renderTime) {
        totalRenderTimeImprovement += result.improvements.renderTime;
        componentsWithRenderImprovement++;
      }
      if (result.improvements.memoryUsage) {
        totalMemoryImprovement += result.improvements.memoryUsage;
        componentsWithMemoryImprovement++;
      }
      if (result.improvements.bundleSize) {
        totalBundleSizeImprovement += result.improvements.bundleSize;
        componentsWithBundleImprovement++;
      }
    });

    // Calculate averages
    report.summary.avgRenderTimeImprovement = componentsWithRenderImprovement > 0 ? 
      (totalRenderTimeImprovement / componentsWithRenderImprovement).toFixed(2) : 0;
    report.summary.avgMemoryImprovement = componentsWithMemoryImprovement > 0 ? 
      (totalMemoryImprovement / componentsWithMemoryImprovement).toFixed(2) : 0;
    report.summary.avgBundleSizeImprovement = componentsWithBundleImprovement > 0 ? 
      (totalBundleSizeImprovement / componentsWithBundleImprovement).toFixed(2) : 0;

    // Generate recommendations
    if (report.summary.avgRenderTimeImprovement > 20) {
      report.recommendations.push('🚀 Excellent render time improvements! Consider applying similar optimizations to other components.');
    }
    if (report.summary.avgMemoryImprovement > 15) {
      report.recommendations.push('🧠 Great memory usage improvements! Memory optimization is working well.');
    }
    if (report.summary.avgBundleSizeImprovement > 10) {
      report.recommendations.push('📦 Bundle size optimization is effective! Consider implementing lazy loading in more areas.');
    }

    // Check for regressions
    this.comparisonResults.forEach(result => {
      if (Object.keys(result.regressions).length > 0) {
        report.recommendations.push(`⚠️ ${result.componentName} shows performance regressions. Review recent changes.`);
      }
    });

    report.detailedResults = this.comparisonResults;
    return report;
  }

  // Auto-benchmark specific operations
  benchmark(componentName, operation, iterations = 100) {
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      operation();
      
      const endTime = performance.now();
      const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
      
      results.push({
        renderTime: endTime - startTime,
        memoryDelta: endMemory - startMemory,
      });
    }

    const avgRenderTime = results.reduce((sum, r) => sum + r.renderTime, 0) / results.length;
    const avgMemoryDelta = results.reduce((sum, r) => sum + r.memoryDelta, 0) / results.length;
    
    const benchmarkResult = {
      componentName,
      iterations,
      avgRenderTime: avgRenderTime.toFixed(2),
      avgMemoryDelta: avgMemoryDelta.toFixed(2),
      minRenderTime: Math.min(...results.map(r => r.renderTime)).toFixed(2),
      maxRenderTime: Math.max(...results.map(r => r.renderTime)).toFixed(2),
      results,
    };

    console.log(`🔬 Benchmark for ${componentName}:`, benchmarkResult);
    return benchmarkResult;
  }

  // Clear all comparison data
  clearData() {
    this.baselines.clear();
    this.currentMetrics.clear();
    this.comparisonResults = [];
    console.log('🧹 Performance comparison data cleared');
  }

  // Export comparison data
  exportData() {
    const exportData = {
      baselines: Object.fromEntries(this.baselines),
      currentMetrics: Object.fromEntries(this.currentMetrics),
      comparisonResults: this.comparisonResults,
      report: this.generateComparisonReport(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-comparison-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📥 Performance comparison data exported');
  }
}

// Utility functions for common performance measurements
export const measureComponentRender = (component, props = {}) => {
  const startTime = performance.now();
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  
  // Simulate component render (in real usage, this would be actual render)
  const result = component(props);
  
  const endTime = performance.now();
  const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  
  return {
    renderTime: endTime - startTime,
    memoryUsage: endMemory - startMemory,
    result,
  };
};

export const measureDataProcessing = (processFunction, data) => {
  const startTime = performance.now();
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  
  const result = processFunction(data);
  
  const endTime = performance.now();
  const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
  
  return {
    processingTime: endTime - startTime,
    memoryUsage: endMemory - startMemory,
    result,
  };
};

// Create global instance
const performanceComparator = new PerformanceComparator();

// Expose to window for easy access in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.performanceComparator = performanceComparator;
  window.measureComponentRender = measureComponentRender;
  window.measureDataProcessing = measureDataProcessing;
}

export default performanceComparator;
export { PerformanceComparator };
