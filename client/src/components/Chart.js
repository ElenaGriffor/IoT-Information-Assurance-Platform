import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Cubie Values',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  });

  const [options, setOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rubik\'s Cube Data Visualization',
      },
    },
  });

  const loadData = async () => {
    try {
      const response = await axios.get('/api/load');
      const data = response.data;
      
      const labels = [];
      const values = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value.label && value.value) {
          labels.push(value.label);
          values.push(value.value);
        }
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Cubie Values',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      });
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="chart-container">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={loadData}>Refresh Chart</button>
      </div>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        {chartData.labels.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#666'
          }}>
            No data available. Add some data to the cube first.
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart; 