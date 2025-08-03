import React, { useState } from 'react';
import { performanceTester } from '../utils/performance-tester';
import './PerformanceTest.css';

interface PerformanceTestProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PerformanceTest: React.FC<PerformanceTestProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<string>('');

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setResults('Running performance test...');
    
    try {
      const testResults = await performanceTester.runPerformanceTest(50);
      const report = performanceTester.getPerformanceReport();
      setResults(report);
    } catch (error) {
      setResults(`Error running test: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="performance-test-overlay">
      <div className="performance-test-modal">
        <div className="performance-test-header">
          <h2>📊 Chart Performance Test</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="performance-test-content">
          <p>This test measures the performance improvements from selective SVG updates.</p>
          
          <div className="test-controls">
            <button 
              className="test-button" 
              onClick={runPerformanceTest}
              disabled={isRunning}
            >
              {isRunning ? '⏳ Running Test...' : '🚀 Run Performance Test'}
            </button>
          </div>
          
          {results && (
            <div className="test-results">
              <h3>Test Results:</h3>
              <pre>{results}</pre>
            </div>
          )}
          
          <div className="test-info">
            <h3>What this test measures:</h3>
            <ul>
              <li>Average render time per chart update</li>
              <li>DOM operations count (target: &lt;50 vs 335 baseline)</li>
              <li>Frame rate stability</li>
              <li>Memory usage</li>
              <li>Optimization effectiveness</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
