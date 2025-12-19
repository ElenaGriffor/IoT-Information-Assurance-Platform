import React, { useState } from 'react';
import './App.css';
import RubiksCube from './components/RubiksCube';
import TechnicalSpecParser from './components/TechnicalSpecParser';
import SpiderChart from './components/SpiderChart';
import VentilatorSpecPDF from './components/VentilatorSpecPDF';
import InitialSetup from './components/InitialSetup';
import EmptyQuadrants from './components/EmptyQuadrants';

function App() {
  const [currentView, setCurrentView] = useState('setup'); // 'setup', 'existing', 'new'
  const [newIotData, setNewIotData] = useState(null);
  const [activeTab, setActiveTab] = useState('cube');

  const handleSetupComplete = (type, data) => {
    if (type === 'existing') {
      setCurrentView('existing');
    } else if (type === 'new') {
      setNewIotData(data);
      setCurrentView('new');
    }
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
    setNewIotData(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'setup':
        return <InitialSetup onComplete={handleSetupComplete} />;
      
      case 'existing':
        return (
          <div className="App">
            <div className="app-header">
              <h1>IoT Analysis Dashboard - Existing Ventilator Models</h1>
              <button onClick={handleBackToSetup} className="back-to-setup-btn">
                ← Back to Main Menu
              </button>
            </div>

            <div className="tabs-header">
              <button
                className={`tab-button ${activeTab === 'cube' ? 'active' : ''}`}
                onClick={() => setActiveTab('cube')}
              >
                Rubik's Cube
              </button>
              <button
                className={`tab-button ${activeTab === 'parser' ? 'active' : ''}`}
                onClick={() => setActiveTab('parser')}
              >
                Technical Spec Parser
              </button>
              <button
                className={`tab-button ${activeTab === 'spider' ? 'active' : ''}`}
                onClick={() => setActiveTab('spider')}
              >
                Spider Chart
              </button>
              <button
                className={`tab-button ${activeTab === 'pdf' ? 'active' : ''}`}
                onClick={() => setActiveTab('pdf')}
              >
                Ventilator Spec PDF
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'cube' && <div className="quadrant"><RubiksCube /></div>}
              {activeTab === 'parser' && <div className="quadrant"><TechnicalSpecParser /></div>}
              {activeTab === 'spider' && <div className="quadrant"><SpiderChart /></div>}
              {activeTab === 'pdf' && <div className="quadrant"><VentilatorSpecPDF /></div>}
            </div>
          </div>
        );
      
      case 'new':
        return <EmptyQuadrants iotData={newIotData} onBack={handleBackToSetup} />;
      
      default:
        return <InitialSetup onComplete={handleSetupComplete} />;
    }
  };

  return renderCurrentView();
}

export default App; 