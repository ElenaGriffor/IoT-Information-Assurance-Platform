import React from 'react';
import './EmptyQuadrants.css';

const EmptyQuadrants = ({ iotData, onBack }) => {
  return (
    <div className="empty-quadrants">
      <div className="header-bar">
        <h2>IoT Analysis Interface: {iotData.name}</h2>
        <button onClick={onBack} className="back-btn">← Back to Setup</button>
      </div>
      
      <div className="quadrants-container">
        <div className="quadrant empty-quadrant">
          <div className="quadrant-header">
            <h3>3D Visualization</h3>
            <span className="status">Ready for Configuration</span>
          </div>
          <div className="quadrant-content">
            <div className="placeholder-content">
              <div className="icon">🎛️</div>
              <h4>Interactive 3D Model</h4>
              <p>Configure your IoT system's 3D representation with subsystems:</p>
              <ul>
                {iotData.subsystems.map((subsystem, index) => (
                  <li key={index}>{subsystem}</li>
                ))}
              </ul>
              <button className="config-btn">Configure 3D Model</button>
            </div>
          </div>
        </div>

        <div className="quadrant empty-quadrant">
          <div className="quadrant-header">
            <h3>AI Analysis Report</h3>
            <span className="status">Ready for Setup</span>
          </div>
          <div className="quadrant-content">
            <div className="placeholder-content">
              <div className="icon">🤖</div>
              <h4>Intelligent Analysis</h4>
              <p>Generate AI-powered reports based on characteristics:</p>
              <ul>
                {iotData.characteristics.map((characteristic, index) => (
                  <li key={index}>{characteristic}</li>
                ))}
              </ul>
              <button className="config-btn">Setup AI Analysis</button>
            </div>
          </div>
        </div>

        <div className="quadrant empty-quadrant">
          <div className="quadrant-header">
            <h3>Data Visualization</h3>
            <span className="status">Awaiting Data</span>
          </div>
          <div className="quadrant-content">
            <div className="placeholder-content">
              <div className="icon">📊</div>
              <h4>Charts & Metrics</h4>
              <p>Visualize information items from your subsystems:</p>
              <div className="info-items-preview">
                {Object.entries(iotData.informationItems).map(([subsystem, items]) => (
                  <div key={subsystem} className="subsystem-items">
                    <strong>{subsystem}:</strong>
                    <span>{items.join(', ')}</span>
                  </div>
                ))}
              </div>
              <button className="config-btn">Configure Charts</button>
            </div>
          </div>
        </div>

        <div className="quadrant empty-quadrant">
          <div className="quadrant-header">
            <h3>System Reports</h3>
            <span className="status">Template Ready</span>
          </div>
          <div className="quadrant-content">
            <div className="placeholder-content">
              <div className="icon">📋</div>
              <h4>PDF Generation</h4>
              <p>Generate comprehensive system reports including:</p>
              <ul>
                <li>System Overview</li>
                <li>Security Assessment</li>
                <li>Performance Metrics</li>
                <li>Compliance Reports</li>
              </ul>
              <button className="config-btn">Setup Reports</button>
            </div>
          </div>
        </div>
      </div>

      <div className="system-summary">
        <h3>System Configuration Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>IoT System:</strong>
            <span>{iotData.name}</span>
          </div>
          <div className="summary-item">
            <strong>Subsystems:</strong>
            <span>{iotData.subsystems.length} configured</span>
          </div>
          <div className="summary-item">
            <strong>Characteristics:</strong>
            <span>{iotData.characteristics.length} defined</span>
          </div>
          <div className="summary-item">
            <strong>Information Items:</strong>
            <span>{Object.values(iotData.informationItems).flat().length} total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyQuadrants; 