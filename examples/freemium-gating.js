// Freemium Feature Gating

// All code is MIT licensed and open source
// But pro features require valid license key

import { 
  usePerformanceMonitoring, 
  PerformanceDashboard,
  CloudSync,           // Available but requires license
  AdvancedAnalytics,   // Available but requires license
  TeamCollaboration    // Available but requires license
} from 'performance-analyzer-lib';

// Initialize with license (optional)
const config = {
  license: {
    key: 'your-license-key',  // Purchase from website
    tier: 'pro',              // 'free', 'pro', 'enterprise'
    validUntil: '2025-12-31'
  }
};

// Usage
const MyComponent = () => {
  const performance = usePerformanceMonitoring('MyComponent', config);
  
  // Free features - always available
  performance.startTiming('operation');
  performance.endTiming('operation');
  
  // Pro features - check license
  if (performance.hasProLicense()) {
    performance.syncToCloud();
    performance.enableAdvancedAnalytics();
  }
  
  return <div>My Component</div>;
};

// Dashboard adapts based on license
const Dashboard = () => {
  return (
    <PerformanceDashboard 
      config={config}
      // Shows upgrade prompts for unlicensed features
      // Unlocks features with valid license
    />
  );
};

// License validation (client-side check + server verification)
const validateLicense = async (licenseKey) => {
  // Local validation for immediate UX
  const isValid = checkLicenseFormat(licenseKey);
  
  // Server validation for security
  const serverValidation = await fetch('https://api.performance-analyzer.com/validate', {
    method: 'POST',
    body: JSON.stringify({ license: licenseKey })
  });
  
  return isValid && serverValidation.ok;
};
