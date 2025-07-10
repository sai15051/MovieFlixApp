import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './StatsDashboard.scss';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const StatsDashboard = ({ stats }) => {
  if (!stats) return <div className="loading">Loading statistics...</div>;


  const genreDistribution = {
    labels: stats.genreCounts?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Number of Movies',
        data: stats.genreCounts?.map(item => item.count) || [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#8AC24A', '#EA5F89',
          '#00BFFF', '#FFD700'
        ],
        borderWidth: 1
      }
    ]
  };

  const ratingsByGenre = {
    labels: stats.genreRatings?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Average Rating',
        data: stats.genreRatings?.map(item => item.avgRating) || [],
        backgroundColor: '#FF4E00',
        borderColor: '#E04500',
        borderWidth: 1
      }
    ]
  };

  const runtimeByYear = {
    labels: stats.runtimeByYear?.map(item => item._id) || [],
    datasets: [
      {
        label: 'Average Runtime (minutes)',
        data: stats.runtimeByYear?.map(item => item.avgRuntime) || [],
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          }
        }
      }
    }
  };

  return (
    <div className="stats-dashboard">
      <h2>Movie Statistics Dashboard</h2>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Genre Distribution</h3>
          <Pie 
            data={genreDistribution} 
            options={options}
          />
        </div>
        
        <div className="chart-container">
          <h3>Average Ratings by Genre</h3>
          <Bar 
            data={ratingsByGenre} 
            options={{
              ...options,
              scales: {
                y: {
                  beginAtZero: false,
                  min: 0,
                  max: 10
                }
              }
            }}
          />
        </div>
        
        <div className="chart-container">
          <h3>Average Runtime by Year</h3>
          <Line 
            data={runtimeByYear} 
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;