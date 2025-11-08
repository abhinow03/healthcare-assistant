import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import HeartIssuePredictor from './HeartIssuePredictor';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HealthDashboard({ userProfile }) {
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    spO2: 98,
    steps: 0,
    heartRateHistory: [],
    stepsHistory: [],
    lastUpdated: new Date()
  });

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'predictor'

  // Simulate updating health metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthMetrics(prev => ({
        ...prev,
        heartRate: Math.floor(Math.random() * (85 - 65) + 65),
        spO2: Math.floor(Math.random() * (100 - 95) + 95),
        steps: prev.steps + Math.floor(Math.random() * 100),
        heartRateHistory: [...prev.heartRateHistory, prev.heartRate].slice(-24),
        stepsHistory: [...prev.stepsHistory, prev.steps].slice(-7),
        lastUpdated: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const heartRateData = {
    labels: Array.from({ length: 24 }, (_, i) => `${23 - i}h ago`).reverse(),
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: healthMetrics.heartRateHistory,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const stepsData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Daily Steps',
        data: healthMetrics.stepsHistory,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Metrics Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Heart Rate</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl text-green-500">{healthMetrics.heartRate}</span>
            <span className="text-gray-400">BPM</span>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Blood Oxygen</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl text-green-500">{healthMetrics.spO2}</span>
            <span className="text-gray-400">%</span>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Daily Steps</h2>
          <div className="flex items-end space-x-2">
            <span className="text-3xl text-green-500">{healthMetrics.steps.toLocaleString()}</span>
            <span className="text-gray-400">steps</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Heart Rate History</h2>
          <Line data={heartRateData} options={chartOptions} />
        </div>

        <div className="bg-gray-700 rounded-lg p-4 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Steps History</h2>
          <Line data={stepsData} options={chartOptions} />
        </div>
      </div>

      {/* Health Insights */}
      <div className="bg-gray-700 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Health Insights</h2>
        <div className="space-y-2">
          <p className="text-gray-300">
            {healthMetrics.heartRate < 60 ? 'Your heart rate is low. Consider light exercise.' :
             healthMetrics.heartRate > 100 ? 'Your heart rate is elevated. Try relaxation techniques.' :
             'Your heart rate is within normal range.'}
          </p>
          <p className="text-gray-300">
            {healthMetrics.steps < 5000 ? 'You\'re a bit behind on steps today. Take a walk!' :
             healthMetrics.steps < 10000 ? 'Good progress on steps. Keep moving!' :
             'Excellent job reaching your step goal!'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      {/* Header with Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Health Dashboard</h1>
          <span className="text-sm text-gray-400">
            Last updated: {healthMetrics.lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('predictor')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'predictor'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            Heart Risk Predictor
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' ? renderOverviewTab() : <HeartIssuePredictor />}
      </div>
    </div>
  );
}

export default HealthDashboard; 