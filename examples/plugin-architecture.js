// Plugin Architecture Example

// Core library (MIT) - free
import { PerformanceAnalyzer } from 'performance-analyzer-lib';

// Pro plugins (Commercial) - paid
import CloudSyncPlugin from '@performance-analyzer/plugin-cloud-sync';
import AdvancedChartsPlugin from '@performance-analyzer/plugin-advanced-charts';
import TeamCollabPlugin from '@performance-analyzer/plugin-team-collab';

// Initialize with plugins
const analyzer = new PerformanceAnalyzer({
  plugins: [
    new CloudSyncPlugin({ apiKey: 'your-key' }),
    new AdvancedChartsPlugin({ theme: 'professional' }),
    new TeamCollabPlugin({ teamId: 'your-team' })
  ]
});

// Free features work without plugins
analyzer.startMonitoring();

// Pro features only available with licensed plugins
analyzer.syncToCloud(); // Requires CloudSyncPlugin
analyzer.generateAdvancedCharts(); // Requires AdvancedChartsPlugin
