import { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import axios from 'axios';

const VENTILATOR_OEMS = [
  { id: 'philips', name: 'Philips Respironics V680' },
  { id: 'drager', name: 'Dräger Evita V800' }
];

const SUBSYSTEMS = {
  '-2': 'Energy',
  '-1': 'Control',
  '0': 'Monitoring',
  '1': 'Security and Human Trust',
  '2': 'Maintenance'
};

const PROPERTIES = {
  '-2': ['Power Efficiency', 'Energy Storage', 'Power Stability', 'Backup Systems', 'Grid Integration'],
  '-1': ['Response Time', 'Accuracy', 'Redundancy', 'Error Handling', 'Calibration'],
  '0': ['Data Collection', 'Real-time Analysis', 'Alert Systems', 'Data Storage', 'Remote Access'],
  '1': ['Confidentiality', 'Integrity', 'Availability', 'Human/Trust', 'Authentication'],
  '2': ['Predictive Maintenance', 'Self-diagnostics', 'Component Lifecycle', 'Service Scheduling', 'Spare Parts']
};

const SUBSYSTEM_COLORS = {
  '-2': 'rgb(255, 0, 0)',    // Energy - Red
  '-1': 'rgb(0, 255, 0)',    // Control - Green
  '0': 'rgb(0, 0, 255)',     // Monitoring - Blue
  '1': 'rgb(0, 150, 200)',   // Security and Human Trust - Cyan Blue
  '2': 'rgb(128, 0, 128)'    // Maintenance - Purple
};

const CustomArrow = ({ start, end, color, headLength = 0.3, headWidth = 0.2 }) => {
  const direction = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  const length = Math.sqrt(direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2);
  
  // Calculate the direction from start to end
  const dir = {
    x: end[0] - start[0],
    y: end[1] - start[1],
    z: end[2] - start[2]
  };
  
  // Calculate the length of the direction vector
  const dirLength = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
  
  // Normalize the direction vector
  const normalized = {
    x: dir.x / dirLength,
    y: dir.y / dirLength,
    z: dir.z / dirLength
  };

  // Create a quaternion that aligns [0, 1, 0] with our direction
  // First, determine the axis of rotation (cross product of [0, 1, 0] and our direction)
  const UP = { x: 0, y: 1, z: 0 };
  
  // Handle special case when direction is parallel to UP
  if (Math.abs(normalized.y) > 0.99) {
    // If pointing up or down, use simple rotation around X axis
    const rotationX = normalized.y > 0 ? 0 : Math.PI;
    
    return (
      <group>
        {/* Arrow shaft */}
        <mesh position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]} rotation={[rotationX, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, length, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Arrow head */}
        <mesh position={end} rotation={[rotationX, 0, 0]}>
          <coneGeometry args={[headWidth, headLength, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }
  
  // For other directions, calculate axis and angle
  const cross = {
    x: UP.y * normalized.z - UP.z * normalized.y,
    y: UP.z * normalized.x - UP.x * normalized.z,
    z: UP.x * normalized.y - UP.y * normalized.x
  };
  
  const crossLength = Math.sqrt(cross.x * cross.x + cross.y * cross.y + cross.z * cross.z);
  
  // Normalize the cross product
  const axis = {
    x: cross.x / crossLength,
    y: cross.y / crossLength,
    z: cross.z / crossLength
  };
  
  // Calculate the angle
  const dot = UP.x * normalized.x + UP.y * normalized.y + UP.z * normalized.z;
  const angle = Math.acos(dot);
  
  return (
    <group>
      {/* Arrow shaft */}
      <group position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2]}>
        <mesh rotation={[0, 0, 0]} quaternion={[Math.sin(angle/2) * axis.x, Math.sin(angle/2) * axis.y, Math.sin(angle/2) * axis.z, Math.cos(angle/2)]}>
          <cylinderGeometry args={[0.05, 0.05, length, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      
      {/* Arrow head */}
      <group position={end}>
        <mesh rotation={[0, 0, 0]} quaternion={[Math.sin(angle/2) * axis.x, Math.sin(angle/2) * axis.y, Math.sin(angle/2) * axis.z, Math.cos(angle/2)]}>
          <coneGeometry args={[headWidth, headLength, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
};

const ReferenceArrows = () => {
  return (
    <group position={[5, 4, 5]}>
      {/* X-Axis Arrow (Properties) - Blue */}
      <CustomArrow
        start={[0, 0, 0]}
        end={[1, 0, 0]}
        color="blue"
        headLength={0.15}
        headWidth={0.1}
      />
      <Text
        position={[1.2, 0, 0]}
        fontSize={0.12}
        color="blue"
        anchorX="center"
        anchorY="middle"
      >
        Properties
      </Text>

      {/* Y-Axis Arrow (Values) - Green */}
      <CustomArrow
        start={[0, 0, 0]}
        end={[0, 0, -1]}  // Changed to point into the screen
        color="green"
        headLength={0.15}
        headWidth={0.1}
      />
      <Text
        position={[0, 0, -1.2]}  // Updated text position
        fontSize={0.12}
        color="green"
        anchorX="center"
        anchorY="middle"
      >
        Values (0-1)
      </Text>
      
      {/* Z-Axis Arrow (Subsystems) - Red */}
      <CustomArrow
        start={[0, 0, 0]}
        end={[0, 1, 0]}  // Changed to point up
        color="red"
        headLength={0.15}
        headWidth={0.1}
      />
      <Text
        position={[0, 1.2, 0]}  // Updated text position
        fontSize={0.12}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        Subsystems
      </Text>
    </group>
  );
};

const CubieInfo = ({ selectedCubie, cubeData, onClose }) => {
  if (!selectedCubie) return null;

  const [x, y] = selectedCubie.split(',').map(Number);
  const subsystem = SUBSYSTEMS[y];        // Changed from z to y
  const property = PROPERTIES[y][x + 2];  // Changed from z to y
  
  // Get value from cubeData and convert to binary (0 or 1)
  const cubieValue = cubeData[selectedCubie]?.value;
  const value = cubieValue !== undefined ? (cubieValue > 0 ? 1 : 0) : null;

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      zIndex: 1000,
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Selected Cubie Info</h3>
      <div style={{ marginBottom: '5px' }}>
        <strong>Subsystem:</strong> {subsystem}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Property:</strong> {property}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Value:</strong> {value !== null ? value : 'Not set'}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Status:</strong> {value === 1 ? 'Active' : 'Inactive'}
      </div>
      <button 
        onClick={onClose}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid white',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

const PopupCube = ({ position, onClose }) => {
  const [popupCubeData, setPopupCubeData] = useState({});

  // Generate pseudo-random cube data based on position
  const generateRandomCubeData = (position) => {
    const data = {};
    // Use the position values as a seed for pseudo-randomness
    const positionSeed = position[0] * 100 + position[1] * 10 + position[2];
    
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          const key = [x, y, z].join(',');
          // Create a deterministic but seemingly random value based on coordinates and seed
          const hashValue = (x + 2) * 100 + (y + 2) * 10 + (z + 3) + positionSeed;
          data[key] = {
            value: hashValue % 2 // Will be either 0 or 1 in a deterministic pattern
          };
        }
      }
    }
    return data;
  };

  useEffect(() => {
    if (position) {
      // Generate a unique pattern for each clicked position
      const randomData = generateRandomCubeData(position);
      setPopupCubeData(randomData);
    }
  }, [position]);

  const generatePopupCubies = () => {
    const cubies = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          const key = [x, y, z].join(',');
          const cubieData = popupCubeData[key] || {};
          const value = cubieData.value || 0;
          // Use different colors based on value
          const color = value === 0 ? '#ffffff' : '#333333';
          
          // Check if this is an outer cubie (on any face of the cube)
          const isOuterX = x === -1 || x === 1;
          const isOuterY = y === -1 || y === 2;
          const isOuterZ = z === -2 || z === 2;
          
          // Higher opacity for outer cubies, more transparent for inner cubies
          const opacity = (isOuterX || isOuterY || isOuterZ) ? 0.6 : 0.2;

          cubies.push(
            <mesh key={key} position={[x, y, z]}>
              <boxGeometry args={[0.9, 0.9, 0.9]} />
              <meshStandardMaterial 
                color={color} 
                transparent={true}
                opacity={opacity}
              />
              {/* Front face (+Z) */}
              <Text 
                position={[0, 0, 0.46]} 
                fontSize={0.4}
                color={value === 1 ? 'red' : 'blue'}
                anchorX="center"
                anchorY="middle"
              >
                {value}
              </Text>
              
              {/* Back face (-Z) */}
              <Text 
                position={[0, 0, -0.46]} 
                fontSize={0.4}
                color={value === 1 ? 'red' : 'blue'}
                anchorX="center"
                anchorY="middle"
                rotation={[0, Math.PI, 0]}
              >
                {value}
              </Text>
              
              {/* Right face (+X) */}
              <Text 
                position={[0.46, 0, 0]} 
                fontSize={0.4}
                color={value === 1 ? 'red' : 'blue'}
                anchorX="center"
                anchorY="middle"
                rotation={[0, Math.PI/2, 0]}
              >
                {value}
              </Text>
              
              {/* Left face (-X) */}
              <Text 
                position={[-0.46, 0, 0]} 
                fontSize={0.4}
                color={value === 1 ? 'red' : 'blue'}
                anchorX="center"
                anchorY="middle"
                rotation={[0, -Math.PI/2, 0]}
              >
                {value}
              </Text>
              
              {/* Top face (+Y) */}
              <Text 
                position={[0, 0.46, 0]} 
                fontSize={0.4}
                color={value === 1 ? 'red' : 'blue'}
                anchorX="center"
                anchorY="middle"
                rotation={[-Math.PI/2, 0, 0]}
              >
                {value}
              </Text>
              
              {/* Bottom face (-Y) */}
              <Text 
                position={[0, -0.46, 0]} 
                fontSize={0.4}
                color={value === 1 ? 'red' : 'blue'}
                anchorX="center"
                anchorY="middle"
                rotation={[Math.PI/2, 0, 0]}
              >
                {value}
              </Text>
            </mesh>
          );
        }
      }
    }
    return cubies;
  };

  return (
    <div style={{
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(135, 206, 250, 0.9)',
      zIndex: 1000
    }}>
      <div style={{ width: '100%', height: '80%' }}>
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          {generatePopupCubies()}
          <OrbitControls enableDamping />
        </Canvas>
      </div>
      <button 
        onClick={onClose}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Close
      </button>
    </div>
  );
};

const Cubie = ({ position, color, onClick, label, value, cubieId, subsystem, property }) => {
  const statusText = value === 0 ? '' : value === 1 ? 'Active' : '';
  
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial 
        color={value === 0 ? 'white' : SUBSYSTEM_COLORS[position[1]]}
        transparent={true}
        opacity={value === 0 ? 0.2 : 0.8}  // More contrast between active and inactive
        wireframe={false}
      />
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.1}
        color="black"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="white"
        maxWidth={0.8}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        {value !== undefined ? `${value}` : ''}
      </Text>
      <Text
        position={[0, 0, -0.5]}
        fontSize={0.05}
        color="black"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="white"
        maxWidth={0.8}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
      >
        {`${subsystem}: ${property}`}
      </Text>
      {statusText && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.05}
          color="black"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="white"
          maxWidth={0.8}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
        >
          {statusText}
        </Text>
      )}
    </mesh>
  );
};

const RubiksCube = () => {
  const [cubeData, setCubeData] = useState({});
  const [selectedCubie, setSelectedCubie] = useState(null);
  const [showPopupCube, setShowPopupCube] = useState(false);
  const [value, setValue] = useState('');
  const [quickValue, setQuickValue] = useState('');
  const [activeTab, setActiveTab] = useState('cube'); // 'cube' or 'popup'
  const [selectedOEM, setSelectedOEM] = useState(() => {
    // Initialize from localStorage or default to first OEM
    const savedOEM = localStorage.getItem('selectedVentilatorOEM');
    return savedOEM || VENTILATOR_OEMS[0].id;
  });

  // Define functions in dependency order - saveCubeData first since it has no dependencies on other functions
  const saveCubeData = useCallback(async (data = cubeData) => {
    console.log(`Saving ventilator data for OEM: ${selectedOEM}`, data);
    try {
      await axios.post('/api/save', { data, oem: selectedOEM });
      console.log(`Data saved successfully for ${selectedOEM} ventilator`);
    } catch (error) {
      console.error('Error saving ventilator data:', error);
    }
  }, [selectedOEM, cubeData]);
  
  const initializeEmptyCube = useCallback(() => {
    console.log(`Initializing demo cube data for ${selectedOEM}`);
    
    // Initialize with a distinct pattern for each OEM
    const initialData = {};
    
    // Create different patterns based on the OEM for visual distinction
    const isPhilips = selectedOEM === 'philips';
    
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const key = [x, y, z].join(',');
          
          // Different activation patterns for visual distinction
          let value = 0;
          if (isPhilips) {
            // Philips: Activate based on specific conditions for distinct pattern
            value = ((x + y + z) % 2 === 0 && Math.abs(x) + Math.abs(y) + Math.abs(z) <= 3) ? 1 : 0;
          } else {
            // Drager: Different pattern - corners and specific positions
            value = ((x === 0 && y === 0) || (Math.abs(x) === 2 && Math.abs(y) === 2)) ? 1 : 0;
          }
          
          initialData[key] = { value };
        }
      }
    }
    setCubeData(initialData);
  }, [selectedOEM]);

  // Function to load from local JSON files - must be defined before loadCubeData
  const loadLocalJson = useCallback(async () => {
    try {
      let localData;
      // Dynamically import the appropriate JSON file based on selected OEM
      if (selectedOEM === 'philips') {
        localData = await import('../data/philipsVentilatorData.json');
      } else {
        localData = await import('../data/dragerVentilatorData.json');
      }
      
      console.log(`Loading data from local ${selectedOEM} JSON file:`, localData);
      
      // Check if we got valid data
      if (localData && typeof localData === 'object') {
        const dataObject = localData.default || localData;
        
        // Clean the data
        const cleanedData = {};
        Object.keys(dataObject).forEach(key => {
          if (key.includes(',')) {
            cleanedData[key] = {
              value: dataObject[key].value !== undefined ? 
                (dataObject[key].value > 0 ? 1 : 0) : 
                0
            };
          }
        });
        
        if (Object.keys(cleanedData).length > 0) {
          console.log(`Setting cube data from local ${selectedOEM} JSON`);
          setCubeData(cleanedData);
          return;
        }
      }
      
      console.log("No valid data found in local JSON, initializing empty cube");
      initializeEmptyCube();
    } catch (localError) {
      console.error('Error loading local JSON:', localError);
      console.log("Initializing empty cube after local JSON failure");
      initializeEmptyCube();
    }
  }, [selectedOEM, initializeEmptyCube]);

  // Define loadCubeData function after loadLocalJson since it depends on it
  const loadCubeData = useCallback(async () => {
    console.log(`Attempting to load ventilator data from OEM: ${selectedOEM}...`);
    try {
      // Try to load from server
      const response = await axios.get(`/api/load?oem=${selectedOEM}`);
      console.log("Server response:", response.data);
      
      // Check if we got valid data that has coordinate keys
      const hasCoordinateKeys = response.data && 
                               typeof response.data === 'object' && 
                               Object.keys(response.data).some(key => key.includes(','));
      
      if (hasCoordinateKeys) {
        console.log(`Setting cube data for ${selectedOEM} ventilator from server`);
        
        // Clean the data to ensure consistent format
        const cleanedData = {};
        
        // Handle case where server returns { data: {...} }
        const dataObject = response.data.data || response.data;
        
        Object.keys(dataObject).forEach(key => {
          if (key.includes(',')) { // It's a coordinate key like "0,-1,1"
            cleanedData[key] = {
              value: dataObject[key].value !== undefined ? 
                (dataObject[key].value > 0 ? 1 : 0) : // Convert any positive value to 1, any 0 to 0
                0 // Default to 0 if no value
            };
          }
        });
        
        if (Object.keys(cleanedData).length > 0) {
          setCubeData(cleanedData);
        } else {
          console.log("No valid coordinates found in response, trying local JSON");
          loadLocalJson();
        }
      } else {
        console.log("Invalid or empty response from server, trying local JSON");
        loadLocalJson();
      }
    } catch (error) {
      console.error('Error loading ventilator data from server:', error);
      console.log("Attempting to load from local JSON");
      loadLocalJson();
    }
  }, [selectedOEM, loadLocalJson]);

  useEffect(() => {
    loadCubeData();
  }, [selectedOEM, loadCubeData]);

  // Persist OEM selection to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedVentilatorOEM', selectedOEM);
  }, [selectedOEM]);



  const handleCubieClick = (position) => {
    const key = position.join(',');
    setSelectedCubie(key);
    setShowPopupCube(true);
    setActiveTab('popup'); // Switch to Detail View tab when cubie is clicked
    if (cubeData[key]) {
      const cubieValue = cubeData[key].value;
      setValue(cubieValue !== undefined ? (cubieValue > 0 ? 1 : 0) : '');
    } else {
      setValue('');
    }
  };

  const handleSaveCubieData = () => {
    if (selectedCubie && value !== '') {
      const newValue = parseInt(value);
      if (newValue === 0 || newValue === 1) {
        const newCubeData = {
          ...cubeData,
          [selectedCubie]: {
            value: newValue
          }
        };
        setCubeData(newCubeData);
        saveCubeData(newCubeData);
        setSelectedCubie(null);
        setValue('');
      } else {
        alert('Value must be either 0 or 1');
      }
    }
  };

  const handleQuickApply = () => {
    if (!quickValue) {
      alert('Please enter a value');
      return;
    }
    if (selectedCubie) {
      const newValue = parseInt(quickValue);
      if (newValue === 0 || newValue === 1) {
        const newCubeData = {
          ...cubeData,
          [selectedCubie]: {
            value: newValue
          }
        };
        setCubeData(newCubeData);
        saveCubeData(newCubeData);
        setQuickValue('');
      } else {
        alert('Value must be either 0 or 1');
      }
    } else {
      alert('Please select a cubie first');
    }
  };

  const handleClosePopup = () => {
    setShowPopupCube(false);
    setSelectedCubie(null);
  };

  const handleCloseInfo = () => {
    setSelectedCubie(null);
    setValue('');
  };

  const handleOEMChange = (e) => {
    setSelectedOEM(e.target.value);
    setSelectedCubie(null);
    setValue('');
    setQuickValue('');
  };

  const generateCubies = () => {
    const cubies = [];
    for (let y = -2; y <= 2; y++) {      // Subsystems on Y-axis
      for (let x = -2; x <= 2; x++) {     // Properties on X-axis
        for (let z = -2; z <= 2; z++) {   // Values on Z-axis
          const key = [x, y, z].join(',');
          const cubieData = cubeData[key] || {};
          const property = PROPERTIES[y][x + 2];
          const subsystem = SUBSYSTEMS[y];
          
          const value = cubieData.value !== undefined ? 
            (cubieData.value > 0 ? 1 : 0) : 
            0;  // Default to 0 instead of undefined
          
          cubies.push(
            <Cubie
              key={key}
              position={[x, y, z]}
              color={SUBSYSTEM_COLORS[y]}
              onClick={() => handleCubieClick([x, y, z])}
              value={value}
              subsystem={subsystem}
              property={property}
            />
          );
        }
      }
    }
    return cubies;
  };

  // Add reset function
  const resetCubeData = () => {
    const resetData = {};
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const key = [x, y, z].join(',');
          resetData[key] = {
            value: 0  // Reset all values to 0
          };
        }
      }
    }
    setCubeData(resetData);
    saveCubeData(resetData);
    setSelectedCubie(null);
    setValue('');
    setQuickValue('');
  };

  return (
    <div className="rubiks-cube-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="cube-controls">
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="ventilator-select" style={{ marginRight: '10px' }}>Select Ventilator Model:</label>
          <select
            id="ventilator-select"
            value={selectedOEM}
            onChange={handleOEMChange}
            style={{
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff'
            }}
          >
            {VENTILATOR_OEMS.map(oem => (
              <option key={oem.id} value={oem.id}>{oem.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={() => saveCubeData()}>Save Ventilator Data</button>
          <button onClick={loadCubeData}>Load Ventilator Data</button>
          <button
            onClick={resetCubeData}
            style={{
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset Data
          </button>
        </div>
        <div style={{
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div>
            <label>Value (0 or 1): </label>
            <input
              type="number"
              min="0"
              max="1"
              value={quickValue}
              onChange={(e) => setQuickValue(e.target.value)}
              placeholder="0 or 1"
              style={{ width: '80px', padding: '5px' }}
            />
          </div>
          <button onClick={handleQuickApply}>Apply</button>
        </div>
      </div>

      {/* Side by side views */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexGrow: 1,
        minHeight: 0
      }}>
        {/* Main Cube - Left Side */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Main Cube
          </div>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <Canvas camera={{ position: [8, 8, 8] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              {generateCubies()}
              <ReferenceArrows />
              <OrbitControls
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.5}
                zoomSpeed={0.5}
                panSpeed={0.5}
              />
            </Canvas>
          </div>
        </div>

        {/* Detail View - Right Side */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Detail View
          </div>
          <div style={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
            {showPopupCube ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(135, 206, 250, 0.9)'
              }}>
                <div style={{ width: '100%', height: '100%', flexGrow: 1 }}>
                  <Canvas camera={{ position: [5, 5, 5] }}>
                    <ambientLight intensity={0.8} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />
                    {selectedCubie && (() => {
                      const position = selectedCubie.split(',').map(Number);
                      const popupCubeData = {};
                      const positionSeed = position[0] * 100 + position[1] * 10 + position[2];

                      for (let x = -1; x <= 1; x++) {
                        for (let y = -1; y <= 2; y++) {
                          for (let z = -2; z <= 2; z++) {
                            const key = [x, y, z].join(',');
                            const hashValue = (x + 2) * 100 + (y + 2) * 10 + (z + 3) + positionSeed;
                            const value = hashValue % 2;

                            const isOuterX = x === -1 || x === 1;
                            const isOuterY = y === -1 || y === 2;
                            const isOuterZ = z === -2 || z === 2;
                            const opacity = (isOuterX || isOuterY || isOuterZ) ? 0.6 : 0.2;
                            const color = value === 0 ? '#ffffff' : '#333333';

                            popupCubeData[key] = (
                              <mesh key={key} position={[x, y, z]}>
                                <boxGeometry args={[0.9, 0.9, 0.9]} />
                                <meshStandardMaterial
                                  color={color}
                                  transparent={true}
                                  opacity={opacity}
                                />
                                <Text
                                  position={[0, 0, 0.46]}
                                  fontSize={0.4}
                                  color={value === 1 ? 'red' : 'blue'}
                                  anchorX="center"
                                  anchorY="middle"
                                >
                                  {value}
                                </Text>
                              </mesh>
                            );
                          }
                        }
                      }
                      return Object.values(popupCubeData);
                    })()}
                    <OrbitControls
                      enableDamping={true}
                      dampingFactor={0.05}
                      rotateSpeed={0.5}
                      zoomSpeed={0.5}
                      panSpeed={0.5}
                    />
                  </Canvas>
                </div>
                <button
                  onClick={handleClosePopup}
                  style={{
                    margin: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close Detail View
                </button>
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                color: '#666',
                fontSize: '16px'
              }}>
                Click a cubie in Main Cube to view its details here
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedCubie && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Edit Cubie Value</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Value (0 or 1): </label>
            <input
              type="number"
              min="0"
              max="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter 0 or 1"
              style={{ width: '100px', padding: '5px' }}
            />
          </div>
          <button onClick={handleSaveCubieData}>Save Value</button>
        </div>
      )}
    </div>
  );
};

export default RubiksCube; 