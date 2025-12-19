import React, { useState } from 'react';
import './InitialSetup.css';

const InitialSetup = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'q1', 'q2', 'q3', 'q4', 'complete'
  const [iotData, setIotData] = useState({
    name: '',
    subsystems: [],
    characteristics: [],
    informationItems: {}
  });

  const [currentSubsystem, setCurrentSubsystem] = useState('');
  const [currentCharacteristic, setCurrentCharacteristic] = useState('');
  const [currentInfoItem, setCurrentInfoItem] = useState('');
  const [selectedSubsystemForInfo, setSelectedSubsystemForInfo] = useState('');

  const handleExistingIoT = () => {
    onComplete('existing', null);
  }
  ;

  const handleNewIoT = () => {
    setCurrentStep('q1');
  };

  const handleQ1Submit = () => {
    if (iotData.name.trim()) {
      setCurrentStep('q2');
    }
  };

  const addSubsystem = () => {
    if (currentSubsystem.trim() && !iotData.subsystems.includes(currentSubsystem)) {
      setIotData(prev => ({
        ...prev,
        subsystems: [...prev.subsystems, currentSubsystem],
        informationItems: { ...prev.informationItems, [currentSubsystem]: [] }
      }));
      setCurrentSubsystem('');
    }
  };

  const removeSubsystem = (subsystem) => {
    setIotData(prev => ({
      ...prev,
      subsystems: prev.subsystems.filter(s => s !== subsystem),
      informationItems: Object.fromEntries(
        Object.entries(prev.informationItems).filter(([key]) => key !== subsystem)
      )
    }));
  };

  const handleQ2Submit = () => {
    if (iotData.subsystems.length > 0) {
      setCurrentStep('q3');
    }
  };

  const addCharacteristic = () => {
    if (currentCharacteristic.trim() && !iotData.characteristics.includes(currentCharacteristic)) {
      setIotData(prev => ({
        ...prev,
        characteristics: [...prev.characteristics, currentCharacteristic]
      }));
      setCurrentCharacteristic('');
    }
  };

  const removeCharacteristic = (characteristic) => {
    setIotData(prev => ({
      ...prev,
      characteristics: prev.characteristics.filter(c => c !== characteristic)
    }));
  };

  const handleQ3Submit = () => {
    if (iotData.characteristics.length > 0) {
      setCurrentStep('q4');
    }
  };

  const addInformationItem = () => {
    if (currentInfoItem.trim() && selectedSubsystemForInfo) {
      setIotData(prev => ({
        ...prev,
        informationItems: {
          ...prev.informationItems,
          [selectedSubsystemForInfo]: [
            ...prev.informationItems[selectedSubsystemForInfo],
            currentInfoItem
          ]
        }
      }));
      setCurrentInfoItem('');
    }
  };

  const removeInformationItem = (subsystem, item) => {
    setIotData(prev => ({
      ...prev,
      informationItems: {
        ...prev.informationItems,
        [subsystem]: prev.informationItems[subsystem].filter(i => i !== item)
      }
    }));
  };

  const handleQ4Submit = () => {
    setCurrentStep('complete');
  };

  const handleCompleteSetup = () => {
    onComplete('new', iotData);
  };

  const renderSelection = () => (
    <div className="setup-container">
      <div className="setup-header">
        <h1>IoT Analysis System</h1>
        <p>Choose how you want to proceed:</p>
      </div>
      <div className="selection-buttons">
        <button className="setup-btn existing" onClick={handleExistingIoT}>
          <h3>View Existing IoT Data</h3>
          <p>Access the current ventilator models analysis</p>
        </button>
        <button className="setup-btn new" onClick={handleNewIoT}>
          <h3>Create New IoT Analysis</h3>
          <p>Set up a new IoT system for analysis</p>
        </button>
      </div>
    </div>
  );

  const renderQ1 = () => (
    <div className="setup-container">
      <div className="setup-header">
        <h2>Question 1 of 4</h2>
        <h3>What do you want to call your IoT?</h3>
      </div>
      <div className="question-content">
        <input
          type="text"
          value={iotData.name}
          onChange={(e) => setIotData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Ventilator XYZ"
          className="setup-input"
        />
        <div className="button-group">
          <button onClick={() => setCurrentStep('selection')} className="btn-secondary">Back</button>
          <button onClick={handleQ1Submit} className="btn-primary" disabled={!iotData.name.trim()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderQ2 = () => (
    <div className="setup-container">
      <div className="setup-header">
        <h2>Question 2 of 4</h2>
        <h3>What are the subsystems/services?</h3>
      </div>
      <div className="question-content">
        <div className="input-group">
          <input
            type="text"
            value={currentSubsystem}
            onChange={(e) => setCurrentSubsystem(e.target.value)}
            placeholder="e.g., Breath sync"
            className="setup-input"
            onKeyPress={(e) => e.key === 'Enter' && addSubsystem()}
          />
          <button onClick={addSubsystem} className="btn-add">Add</button>
        </div>
        <div className="items-list">
          {iotData.subsystems.map((subsystem, index) => (
            <div key={index} className="item-tag">
              <span>{subsystem}</span>
              <button onClick={() => removeSubsystem(subsystem)} className="btn-remove">×</button>
            </div>
          ))}
        </div>
        <div className="button-group">
          <button onClick={() => setCurrentStep('q1')} className="btn-secondary">Back</button>
          <button onClick={handleQ2Submit} className="btn-primary" disabled={iotData.subsystems.length === 0}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderQ3 = () => (
    <div className="setup-container">
      <div className="setup-header">
        <h2>Question 3 of 4</h2>
        <h3>What characteristics are relevant?</h3>
      </div>
      <div className="question-content">
        <div className="input-group">
          <input
            type="text"
            value={currentCharacteristic}
            onChange={(e) => setCurrentCharacteristic(e.target.value)}
            placeholder="e.g., availability, integrity, confidentiality"
            className="setup-input"
            onKeyPress={(e) => e.key === 'Enter' && addCharacteristic()}
          />
          <button onClick={addCharacteristic} className="btn-add">Add</button>
        </div>
        <div className="items-list">
          {iotData.characteristics.map((characteristic, index) => (
            <div key={index} className="item-tag">
              <span>{characteristic}</span>
              <button onClick={() => removeCharacteristic(characteristic)} className="btn-remove">×</button>
            </div>
          ))}
        </div>
        <div className="button-group">
          <button onClick={() => setCurrentStep('q2')} className="btn-secondary">Back</button>
          <button onClick={handleQ3Submit} className="btn-primary" disabled={iotData.characteristics.length === 0}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderQ4 = () => (
    <div className="setup-container">
      <div className="setup-header">
        <h2>Question 4 of 4</h2>
        <h3>What information items are involved in each subsystem/service?</h3>
        <p>Information items come from sensors and are factored when assessing characteristics</p>
      </div>
      <div className="question-content">
        <div className="subsystem-selector">
          <select
            value={selectedSubsystemForInfo}
            onChange={(e) => setSelectedSubsystemForInfo(e.target.value)}
            className="setup-select"
          >
            <option value="">Select a subsystem</option>
            {iotData.subsystems.map((subsystem, index) => (
              <option key={index} value={subsystem}>{subsystem}</option>
            ))}
          </select>
        </div>
        {selectedSubsystemForInfo && (
          <div className="input-group">
            <input
              type="text"
              value={currentInfoItem}
              onChange={(e) => setCurrentInfoItem(e.target.value)}
              placeholder="e.g., breathing frequency"
              className="setup-input"
              onKeyPress={(e) => e.key === 'Enter' && addInformationItem()}
            />
            <button onClick={addInformationItem} className="btn-add">Add to {selectedSubsystemForInfo}</button>
          </div>
        )}
        <div className="subsystems-info">
          {iotData.subsystems.map((subsystem, index) => (
            <div key={index} className="subsystem-info">
              <h4>{subsystem}</h4>
              <div className="items-list">
                {iotData.informationItems[subsystem]?.map((item, itemIndex) => (
                  <div key={itemIndex} className="item-tag">
                    <span>{item}</span>
                    <button onClick={() => removeInformationItem(subsystem, item)} className="btn-remove">×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="button-group">
          <button onClick={() => setCurrentStep('q3')} className="btn-secondary">Back</button>
          <button onClick={handleQ4Submit} className="btn-primary">Complete Setup</button>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="setup-container">
      <div className="setup-header">
        <h2>Setup Complete!</h2>
        <h3>Your IoT system "{iotData.name}" is ready for analysis</h3>
      </div>
      <div className="question-content">
        <div className="summary">
          <div className="summary-section">
            <h4>Subsystems ({iotData.subsystems.length})</h4>
            <ul>
              {iotData.subsystems.map((subsystem, index) => (
                <li key={index}>{subsystem}</li>
              ))}
            </ul>
          </div>
          <div className="summary-section">
            <h4>Characteristics ({iotData.characteristics.length})</h4>
            <ul>
              {iotData.characteristics.map((characteristic, index) => (
                <li key={index}>{characteristic}</li>
              ))}
            </ul>
          </div>
          <div className="summary-section">
            <h4>Information Items</h4>
            {iotData.subsystems.map((subsystem, index) => (
              <div key={index}>
                <strong>{subsystem}:</strong>
                <ul>
                  {iotData.informationItems[subsystem]?.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="button-group">
          <button onClick={() => setCurrentStep('q4')} className="btn-secondary">Back</button>
          <button onClick={handleCompleteSetup} className="btn-primary">
            Proceed to Analysis Interface
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'selection':
        return renderSelection();
      case 'q1':
        return renderQ1();
      case 'q2':
        return renderQ2();
      case 'q3':
        return renderQ3();
      case 'q4':
        return renderQ4();
      case 'complete':
        return renderComplete();
      default:
        return renderSelection();
    }
  };

  return <div className="initial-setup">{renderCurrentStep()}</div>;
};

export default InitialSetup; 