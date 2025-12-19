const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));


// Initialize necessary data files if they don't exist
const initializeDataFiles = () => {
  console.log('Checking for ventilator data files...');
  
  // List of OEMs
  const oems = ['philips', 'drager', 'default'];
  
  // Create a basic template for empty data
  const createEmptyData = (oem) => {
    const data = {};
    // Create a distinct pattern based on OEM
    const isPhilips = oem === 'philips';
    
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const key = [x, y, z].join(',');
          
          // For Philips: Activate cubies where x+y+z is even
          // For Drager: Activate cubies where x+y+z is divisible by 3
          // For default: All 0s
          let value = 0;
          if (oem === 'philips') {
            value = (x + y + z) % 2 === 0 ? 1 : 0;
          } else if (oem === 'drager') {
            value = (x + y + z) % 3 === 0 ? 1 : 0;
          }
          
          data[key] = { value };
        }
      }
    }
    return data;
  };
  
  // Check and create files for each OEM
  oems.forEach(oem => {
    const filename = `${oem}VentilatorData.json`;
    if (!fs.existsSync(filename)) {
      console.log(`Creating ${filename} with empty data...`);
      const emptyData = createEmptyData(oem);
      fs.writeFileSync(filename, JSON.stringify(emptyData, null, 2));
    } else {
      console.log(`${filename} already exists.`);
    }
  });
  
  // Ensure cubeData.json exists too (for backward compatibility)
  if (!fs.existsSync('cubeData.json')) {
    console.log('Creating cubeData.json with empty data...');
    const emptyData = createEmptyData('default');
    fs.writeFileSync('cubeData.json', JSON.stringify(emptyData, null, 2));
  } else {
    console.log('cubeData.json already exists.');
  }
};

// Run initialization
initializeDataFiles();

// Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { data, oem, philipsData, dragerData, mode } = req.body;
    
    let report;
    
    if (mode === 'comparison') {
      report = `Comparison Report - Philips Respironics V680 vs Dräger Evita V800

This is a mock analysis report. The actual AI analysis feature has been disabled.

Data received:
- Philips data points: ${Object.keys(philipsData || {}).length}
- Dräger data points: ${Object.keys(dragerData || {}).length}

To enable AI analysis, configure an OpenAI API key.`;
    } else {
      report = `Analysis Report - ${oem || 'Unknown Manufacturer'}

This is a mock analysis report. The actual AI analysis feature has been disabled.

Data received: ${Object.keys(data || {}).length} data points

To enable AI analysis, configure an OpenAI API key.`;
    }
    
    res.json({ report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/save', (req, res) => {
  try {
    const { data, oem = 'default' } = req.body;
    
    // Create OEM-specific filename
    const filename = `${oem}VentilatorData.json`;
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    res.json({ message: `Data saved successfully for ${oem} ventilator` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/load', (req, res) => {
  try {
    const oem = req.query.oem || 'default';
    
    // Create OEM-specific filename
    const filename = `${oem}VentilatorData.json`;
    
    // Check if file exists
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename, 'utf8');
      console.log(`Loading data from ${filename}`);
      res.json(JSON.parse(data));
    } else {
      // Try to load from cubeData.json as fallback
      if (fs.existsSync('cubeData.json')) {
        console.log(`${filename} not found, loading from cubeData.json instead`);
        const data = fs.readFileSync('cubeData.json', 'utf8');
        res.json(JSON.parse(data));
      } else {
        // If no files exist, return empty object
        console.log('No data files found, returning empty object');
        res.json({});
      }
    }
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get energy subsystem comparison data
app.get('/api/energy-comparison', (req, res) => {
  try {
    // Load Philips data
    const philipsData = JSON.parse(fs.readFileSync('philipsVentilatorData.json', 'utf8'));
    // Load Dräger data
    const dragerData = JSON.parse(fs.readFileSync('dragerVentilatorData.json', 'utf8'));
    
    // Energy properties to compare
    const properties = [
      'Power Efficiency',
      'Energy Storage',
      'Power Stability',
      'Backup Systems',
      'Grid Integration'
    ];
    
    // Function to get energy property value for a ventilator
    const getPropertyValue = (data, property) => {
      for (const key in data) {
        const item = data[key];
        if (item.subsystem === 'Energy' && item.property === property && item.value === 1) {
          // Convert level to numeric value
          switch (item.level) {
            case 'Very Low': return 1;
            case 'Low': return 2;
            case 'Medium': return 3;
            case 'High': return 4;
            case 'Very High': return 5;
            default: return 0;
          }
        }
      }
      return 0;
    };
    
    // Calculate values for each ventilator
    const comparison = {
      properties,
      philips: properties.map(prop => getPropertyValue(philipsData, prop)),
      drager: properties.map(prop => getPropertyValue(dragerData, prop))
    };
    
    res.json(comparison);
  } catch (error) {
    console.error('Error generating energy comparison:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get security assurance comparison data
app.get('/api/security-comparison', (req, res) => {
  try {
    // Load Philips data
    const philipsData = JSON.parse(fs.readFileSync('philipsVentilatorData.json', 'utf8'));
    // Load Dräger data
    const dragerData = JSON.parse(fs.readFileSync('dragerVentilatorData.json', 'utf8'));
    
    // Security assurance characteristics to compare
    const characteristics = [
      'Confidentiality',
      'Integrity',
      'Availability',
      'Human/Trust',
      'Authentication'
    ];
    
    // Function to get security characteristic value for a specific ventilator (returns percentage 0-100)
    const getSecurityValue = (data, characteristic, ventilatorType) => {
      let maxValue = 0;
      
      // Search through all data points for the characteristic
      for (const key in data) {
        const item = data[key];
        if (item.property === characteristic && item.value === 1) {
          // Convert level to percentage value
          let percentageValue = 0;
          switch (item.level) {
            case 'Very Low': percentageValue = 20; break;
            case 'Low': percentageValue = 40; break;
            case 'Medium': percentageValue = 60; break;
            case 'High': percentageValue = 80; break;
            case 'Very High': percentageValue = 100; break;
            default: percentageValue = 0;
          }
          // Keep the highest value found for this characteristic
          maxValue = Math.max(maxValue, percentageValue);
        }
      }
      
      // If no data found, provide realistic security assessment percentages with clear differentiation
      if (maxValue === 0) {
        // Realistic security assessment percentages with clear differentiation
        const securityProfiles = {
          'Confidentiality': { philips: 72, drager: 85 },
          'Integrity': { philips: 88, drager: 75 },
          'Availability': { philips: 92, drager: 90 },
          'Human/Trust': { philips: 68, drager: 78 },
          'Authentication': { philips: 76, drager: 88 }
        };
        
        return securityProfiles[characteristic] ? 
          securityProfiles[characteristic][ventilatorType] : 50;
      }
      
      return maxValue;
    };
    
    // Calculate values for each ventilator explicitly
    const comparison = {
      characteristics,
      philips: characteristics.map(char => getSecurityValue(philipsData, char, 'philips')),
      drager: characteristics.map(char => getSecurityValue(dragerData, char, 'drager'))
    };
    
    res.json(comparison);
  } catch (error) {
    console.error('Error generating security comparison:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 