import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SpiderChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [options] = useState({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'point'
    },
    animation: {
      duration: 500
    },
    elements: {
      line: {
        tension: 0.1
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (value) => {
            if (value === 0) return '';
            return value + '%';
          },
          color: '#666',
          font: {
            size: 9
          }
        },
        pointLabels: {
          font: {
            size: 9,
            weight: 'bold'
          },
          color: '#333'
        },
        grid: {
          color: '#e0e0e0'
        },
        angleLines: {
          color: '#e0e0e0'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 8,
          font: {
            size: 10,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: 'Security Comparison',
        font: {
          size: 12,
          weight: 'bold'
        },
        padding: {
          bottom: 8
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.r + '%';
          }
        }
      }
    },
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load demo data directly for now (simulating ventilator security analysis)
      const fallbackData = {
        characteristics: ['Confidentiality', 'Integrity', 'Availability', 'Human/Trust', 'Authentication'],
        philips: [72, 88, 92, 68, 76],
        drager: [85, 75, 90, 78, 88]
      };
      
      console.log('Loading security comparison data');
      setChartData({
        labels: fallbackData.characteristics,
        datasets: [
          {
            label: 'Philips Respironics V680',
            data: fallbackData.philips,
            backgroundColor: 'rgba(33, 150, 243, 0.25)',
            borderColor: 'rgba(33, 150, 243, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(33, 150, 243, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(33, 150, 243, 1)',
            pointHoverRadius: 6
          },
          {
            label: 'Dräger Evita V800',
            data: fallbackData.drager,
            backgroundColor: 'rgba(255, 152, 0, 0.25)',
            borderColor: 'rgba(255, 152, 0, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 152, 0, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 152, 0, 1)',
            pointHoverRadius: 6
          }
        ]
      });
      
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Failed to load security analysis data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="spider-chart-container">
      <div style={{ height: '100%', position: 'relative', minHeight: '200px' }}>
        {error ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#d32f2f' 
          }}>
            {error}
          </div>
        ) : loading ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#666'
          }}>
            Loading security characteristics data...
          </div>
        ) : chartData.labels.length > 0 ? (
          <Radar data={chartData} options={options} />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: '#666'
          }}>
            No security comparison data available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SpiderChart; 