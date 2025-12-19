import React, { useState } from 'react';

const VentilatorSpecPDF = () => {
  const [selectedPDF, setSelectedPDF] = useState('Synthetic_Ventilator_Model_1X_Spec.pdf');
  
  // List of available PDFs
  const availablePDFs = [
    { id: 'synthetic', name: 'Synthetic Ventilator Model 1X', file: 'Synthetic_Ventilator_Model_1X_Spec.pdf' },
    { id: 'copy', name: 'Copy PDF', file: 'copy.pdf' }
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f5f5f5'
      }}>
        <label htmlFor="pdf-select" style={{ marginRight: '10px' }}>
          Technical Specification:
        </label>
        <select 
          id="pdf-select"
          value={selectedPDF}
          onChange={(e) => setSelectedPDF(e.target.value)}
          style={{ 
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          {availablePDFs.map(pdf => (
            <option key={pdf.id} value={pdf.file}>{pdf.name}</option>
          ))}
        </select>
      </div>
      
      <iframe
        src={`/pdf/${selectedPDF}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          border: 'none' 
        }}
        title="Ventilator Technical Specification"
      />
    </div>
  );
};

export default VentilatorSpecPDF;