import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import TrafficPredictionCard from './components/TrafficPredictionCard.jsx';
import RouteMapCard from './components/RouteMapCard.jsx';

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function App() {
  const [source, setSource] = useState('Alwal');
  const [destination, setDestination] = useState('Secunderabad Station');
  const [hour, setHour] = useState(14);
  const [weather, setWeather] = useState('Clear');

  const [predictionData, setPredictionData] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const [loadingPredict, setLoadingPredict] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Predict Traffic API
  const handlePredictTraffic = async () => {
    setLoadingPredict(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/traffic/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, hour, weather })
      });

      if (!response.ok) {
        throw new Error(`Traffic API Error (${response.status})`);
      }

      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(`Failed to connect to backend: ${err.message}. Make sure FastAPI server is running on port 8000.`);
    } finally {
      setLoadingPredict(false);
    }
  };

  // Handle Find Best Route API
  const handleFindBestRoute = async () => {
    setLoadingRoute(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/route/best`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, hour })
      });

      if (!response.ok) {
        throw new Error(`Route API Error (${response.status})`);
      }

      const data = await response.json();
      setRouteData(data);
    } catch (err) {
      console.error(err);
      setErrorMessage(`Route calculation failed: ${err.message}`);
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar backendUrl={BACKEND_URL} />

      <main className="dashboard-main">
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1.25rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>⚠️ {errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          {/* Left Navigation Console */}
          <div>
            <ControlPanel
              source={source} setSource={setSource}
              destination={destination} setDestination={setDestination}
              hour={hour} setHour={setHour}
              weather={weather} setWeather={setWeather}
              onPredict={handlePredictTraffic}
              onFindRoute={handleFindBestRoute}
              loadingPredict={loadingPredict}
              loadingRoute={loadingRoute}
            />
          </div>

          {/* Right Dashboard Visualization Column */}
          <div className="right-column">
            <div className="cards-grid">
              <TrafficPredictionCard data={predictionData} weather={weather} hour={hour} />
              <RouteMapCard data={routeData} hour={hour} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
