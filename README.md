# Performance Analyzer Library

A comprehensive performance analysis library for React applications that provides monitoring, benchmarking, and optimization tools.

## Features

- **Performance Monitoring**: Real-time performance tracking with hooks and HOCs
- **Visual Dashboard**: Interactive dashboard with charts and metrics
- **Benchmarking**: Automated performance testing and comparison
- **Console Tools**: Command-line analysis and debugging utilities
- **Export Reports**: Generate and export performance reports
- **Modular Design**: Use only the components you need

## Installation

```bash
npm install performance-analyzer-lib
```

## Quick Start

```javascript
import { usePerformanceMonitoring, PerformanceDashboard } from 'performance-analyzer-lib';

// Use performance monitoring hook
function MyComponent() {
  const { startTiming, endTiming, getMetrics } = usePerformanceMonitoring();
  
  useEffect(() => {
    startTiming('data-fetch');
    fetchData().then(() => {
      endTiming('data-fetch');
    });
  }, []);
  
  return <div>My Component</div>;
}

// Add dashboard to your app
function App() {
  return (
    <div>
      <MyComponent />
      <PerformanceDashboard />
    </div>
  );
}
```

## Documentation

- [📖 Comprehensive Guide](https://github.com/Squapale/react-performance-analyzer/blob/main/docs/COMPREHENSIVE_PERFORMANCE_GUIDE.md)
- [⚡ Quick Reference](https://github.com/Squapale/react-performance-analyzer/blob/main/docs/PERFORMANCE_QUICK_REFERENCE.md)
- [🎯 Examples](https://github.com/Squapale/react-performance-analyzer/tree/main/examples)

## API Reference

### Core
- `usePerformanceMonitoring()` - Main monitoring hook
- `withPerformanceMonitoring()` - HOC for class components
- `PerformanceMonitor` - Global monitoring instance
- `performanceLogger` - Utility for performance logging

### Components
- `PerformanceDashboard` - Visual dashboard
- `PerformanceToggle` - Toggle for enabling/disabling monitoring

### Testing
- `PerformanceTestSuite` - Automated testing utilities
- `PerformanceComparator` - Before/after comparison tools

### Utils
- `performanceAnalysisExamples` - Console analysis tools
- `performanceExamples` - Advanced usage examples

## Examples

### Basic Performance Monitoring

```javascript
import { usePerformanceMonitoring, performanceLogger } from 'performance-analyzer-lib';

function MyComponent() {
  const { startTiming, endTiming } = usePerformanceMonitoring();
  
  const handleClick = async () => {
    startTiming('user-action');
    await performAction();
    const duration = endTiming('user-action');
    
    performanceLogger.info('User action completed', { duration });
  };
  
  return <button onClick={handleClick}>Perform Action</button>;
}
```

### Performance Dashboard

```javascript
import { PerformanceDashboard } from 'performance-analyzer-lib';

function App() {
  return (
    <div>
      {/* Your app content */}
      <PerformanceDashboard 
        position="bottom-right"
        enableExport={true}
      />
    </div>
  );
}
```

## Links

- [📦 npm Package](https://www.npmjs.com/package/performance-analyzer-lib)
- [🔗 GitHub Repository](https://github.com/Squapale/react-performance-analyzer)
- [📝 Issues & Bug Reports](https://github.com/Squapale/react-performance-analyzer/issues)
- [🤝 Contributing](https://github.com/Squapale/react-performance-analyzer/blob/main/CONTRIBUTING.md)

## License

MIT - See [LICENSE](https://github.com/Squapale/react-performance-analyzer/blob/main/LICENSE) for details.
