import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Use the same VENTILATOR_OEMS constant for consistency
const VENTILATOR_OEMS = [
  { id: 'philips', name: 'Philips Respironics V680' },
  { id: 'drager', name: 'Dräger Evita V800' }
];

const AIReport = () => {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOEM, setSelectedOEM] = useState(VENTILATOR_OEMS[0].id);
  const [compareMode, setCompareMode] = useState(false);

  // Keep OEM selection in sync with RubiksCube component using localStorage
  useEffect(() => {
    const savedOEM = localStorage.getItem('selectedVentilatorOEM');
    if (savedOEM) {
      setSelectedOEM(savedOEM);
    }
  }, []);

  // Update localStorage when OEM changes
  useEffect(() => {
    localStorage.setItem('selectedVentilatorOEM', selectedOEM);
  }, [selectedOEM]);

  const generateReport = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (compareMode) {
        // In compare mode, load data for both OEMs and generate a comparison report
        const [philipsResponse, dragerResponse] = await Promise.all([
          axios.get('/api/load?oem=philips'),
          axios.get('/api/load?oem=drager')
        ]);
        
        const philipsData = philipsResponse.data;
        const dragerData = dragerResponse.data;
        
        // Send both datasets for comparison
        const analysisResponse = await axios.post('/api/analyze', { 
          philipsData,
          dragerData,
          mode: 'comparison'
        });
        
        setReport(analysisResponse.data.report);
      } else {
        // Standard single OEM report
        const response = await axios.get(`/api/load?oem=${selectedOEM}`);
        const data = response.data;
        
        const analysisResponse = await axios.post('/api/analyze', { 
          data,
          oem: selectedOEM 
        });
        
        setReport(analysisResponse.data.report);
      }
    } catch (error) {
      setError('Error generating report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle OEM change
  const handleOEMChange = (e) => {
    const newOEM = e.target.value;
    setSelectedOEM(newOEM);
  };

  // Toggle comparison mode
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
  };

  return (
    <div className="ai-report-container">
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {!compareMode && (
          <>
            <label htmlFor="ventilator-select">Ventilator Model:</label>
            <select 
              id="ventilator-select" 
              value={selectedOEM}
              onChange={handleOEMChange}
              style={{ 
                padding: '5px 10px', 
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            >
              {VENTILATOR_OEMS.map(oem => (
                <option key={oem.id} value={oem.id}>{oem.name}</option>
              ))}
            </select>
          </>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="checkbox" 
            id="compare-mode" 
            checked={compareMode} 
            onChange={toggleCompareMode}
          />
          <label htmlFor="compare-mode">Compare Both Ventilators</label>
        </div>
        
        <button 
          onClick={generateReport}
          disabled={loading}
          style={{ marginLeft: 'auto' }}
        >
          {loading ? 'Generating Report...' : compareMode ? 'Generate Comparison Report' : 'Generate AI Report'}
        </button>
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <div className="report-content">
        {report ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{report}</div>
        ) : (
          <div style={{ color: '#666' }}>
            {compareMode 
              ? 'Click the button above to generate a comparison report between Philips and Dräger ventilators.'
              : 'Click the button above to generate an AI report for the selected ventilator.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReport; 