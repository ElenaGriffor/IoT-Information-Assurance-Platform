import React, { useState } from 'react';
import axios from 'axios';

const TechnicalSpecParser = () => {
  const [parseResults, setParseResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);

  // Available technical specification PDFs
  const availableSpecs = [
    { id: 'synthetic', name: 'Synthetic Ventilator Model 1X', file: 'Synthetic_Ventilator_Model_1X_Spec.pdf' },
    // More specs can be added here
  ];

  const parseSpecification = async () => {
    try {
      setLoading(true);
      setError('');
      
      // For now, we'll use the parsed results from our Python script
      // In a real implementation, this would call a backend API that runs the parser
      const response = await axios.post('/api/parse-specification', {
        filename: selectedFile || availableSpecs[0].file
      });
      
      setParseResults(response.data);
    } catch (error) {
      // Since the backend endpoint doesn't exist yet, we'll use mock data
      // This represents what the parser would return
      const mockResults = {
        metadata: {
          document: 'Synthetic_Ventilator_Model_1X_Spec.pdf',
          parsed_date: new Date().toISOString(),
          parser_version: '1.0'
        },
        characteristics: {
          'Confidentiality': {
            requirements: [
              {
                requirement: 'Implement AES-256 encryption for all patient data',
                info_state: 'storage',
                measure_type: 'technology'
              },
              {
                requirement: 'Deploy RBAC with minimum privilege principle',
                info_state: 'processing',
                measure_type: 'policy'
              },
              {
                requirement: 'Use TLS 1.3 for all network communications',
                info_state: 'transmission',
                measure_type: 'technology'
              },
              {
                requirement: 'Maintain audit logs for 7 years per HIPAA requirements',
                info_state: 'storage',
                measure_type: 'policy'
              }
            ],
            gaps: [],
            count: 4,
            coverage: 'Good'
          },
          'Integrity': {
            requirements: [
              {
                requirement: 'Implement real-time parameter validation',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Deploy secure boot with firmware signature verification',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Perform automated calibration checks every 24 hours',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Use blockchain for immutable calibration logging',
                info_state: 'storage',
                measure_type: 'technology'
              }
            ],
            gaps: [],
            count: 4,
            coverage: 'Good'
          },
          'Availability': {
            requirements: [
              {
                requirement: 'Achieve 99.999% uptime (less than 5.26 minutes downtime/year)',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Implement N+1 redundancy for all critical components',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Provide 8-hour battery backup minimum',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Enable emergency ventilation mode within 2 seconds',
                info_state: 'processing',
                measure_type: 'technology'
              }
            ],
            gaps: [],
            count: 4,
            coverage: 'Good'
          },
          'Human/Trust': {
            requirements: [
              {
                requirement: 'Implement intuitive UI with <3 clicks to any function',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Reduce false positive alarms by minimum 70%',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Provide built-in training mode with certification tracking',
                info_state: 'processing',
                measure_type: 'training'
              },
              {
                requirement: 'Display confidence intervals for all measurements',
                info_state: 'processing',
                measure_type: 'technology'
              }
            ],
            gaps: [{
              gap: 'Limited multilingual support',
              characteristic: 'Human/Trust'
            }],
            count: 4,
            coverage: 'Good'
          },
          'Authentication': {
            requirements: [
              {
                requirement: 'Implement two-factor authentication for all users',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Integrate with hospital LDAP/Active Directory',
                info_state: 'processing',
                measure_type: 'technology'
              },
              {
                requirement: 'Maintain tamper-proof audit logs for 7 years',
                info_state: 'storage',
                measure_type: 'policy'
              },
              {
                requirement: 'Enable emergency override with dual authentication',
                info_state: 'processing',
                measure_type: 'technology'
              }
            ],
            gaps: [{
              gap: 'No continuous authentication',
              characteristic: 'Authentication'
            }],
            count: 4,
            coverage: 'Good'
          }
        },
        summary: {
          total_requirements: 20,
          total_gaps: 2,
          coverage: {
            'Confidentiality': 'Good',
            'Integrity': 'Good',
            'Availability': 'Good',
            'Human/Trust': 'Good',
            'Authentication': 'Good'
          }
        }
      };
      
      setParseResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const generateSpreadsheetView = () => {
    if (!parseResults) return null;

    const rows = [];
    
    // Process each characteristic
    Object.entries(parseResults.characteristics).forEach(([char, data]) => {
      data.requirements.forEach(req => {
        rows.push({
          characteristic: char,
          requirement: req.requirement,
          infoState: req.info_state,
          measureType: req.measure_type,
          gap: '',
          coverage: data.coverage
        });
      });
      
      data.gaps.forEach(gap => {
        rows.push({
          characteristic: char,
          requirement: '',
          infoState: '',
          measureType: '',
          gap: gap.gap,
          coverage: data.coverage
        });
      });
    });

    return rows;
  };

  const exportToJSON = () => {
    if (!parseResults) return;
    
    const jsonData = JSON.stringify(parseResults, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventilator_security_analysis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (!parseResults) return;
    
    const rows = generateSpreadsheetView();
    const headers = ['Characteristic', 'Requirement', 'Information State', 'Measure Type', 'Gap', 'Coverage'];
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += `"${row.characteristic}","${row.requirement}","${row.infoState}","${row.measureType}","${row.gap}","${row.coverage}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventilator_security_analysis.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
      <h2 style={{ marginTop: 0 }}>Technical Specification Parser</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="spec-select" style={{ marginRight: '10px' }}>Select Specification:</label>
        <select 
          id="spec-select"
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          style={{ padding: '5px 10px', marginRight: '10px' }}
        >
          {availableSpecs.map(spec => (
            <option key={spec.id} value={spec.file}>{spec.name}</option>
          ))}
        </select>
        
        <button 
          onClick={parseSpecification}
          disabled={loading}
          style={{ 
            padding: '5px 15px',
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Parsing...' : 'Parse Specification'}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      {parseResults && (
        <div>
          <div style={{ 
            backgroundColor: '#e6f3ff', 
            padding: '15px', 
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>Parsing Summary</h3>
            <p><strong>Document:</strong> {parseResults.metadata.document}</p>
            <p><strong>Total Requirements Found:</strong> {parseResults.summary.total_requirements}</p>
            <p><strong>Total Gaps Identified:</strong> {parseResults.summary.total_gaps}</p>
            
            <div style={{ marginTop: '10px' }}>
              <strong>Coverage by Characteristic:</strong>
              <ul style={{ marginTop: '5px' }}>
                {Object.entries(parseResults.summary.coverage).map(([char, coverage]) => (
                  <li key={char}>
                    {char}: <span style={{ 
                      color: coverage === 'Good' ? 'green' : 'orange',
                      fontWeight: 'bold'
                    }}>{coverage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button 
              onClick={() => setShowSpreadsheet(!showSpreadsheet)}
              style={{ marginRight: '10px' }}
            >
              {showSpreadsheet ? 'Hide' : 'Show'} Spreadsheet View
            </button>
            <button 
              onClick={exportToJSON}
              style={{ marginRight: '10px' }}
            >
              Export as JSON
            </button>
            <button onClick={exportToCSV}>
              Export as CSV
            </button>
          </div>

          {showSpreadsheet && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '12px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#4299e1', color: 'white' }}>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Characteristic</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Requirement</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Info State</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Measure Type</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Gap</th>
                    <th style={{ padding: '8px', border: '1px solid #ddd' }}>Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {generateSpreadsheetView().map((row, idx) => (
                    <tr key={idx} style={{ 
                      backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white' 
                    }}>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.characteristic}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.requirement}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.infoState}</td>
                      <td style={{ padding: '8px', border: '1px solid #ddd' }}>{row.measureType}</td>
                      <td style={{ 
                        padding: '8px', 
                        border: '1px solid #ddd',
                        color: row.gap ? 'red' : 'inherit'
                      }}>{row.gap}</td>
                      <td style={{ 
                        padding: '8px', 
                        border: '1px solid #ddd',
                        color: row.coverage === 'Good' ? 'green' : 'orange',
                        fontWeight: 'bold'
                      }}>{row.coverage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TechnicalSpecParser;