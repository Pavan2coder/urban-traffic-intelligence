import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleMatrixCanvas from './components/reactbits/ParticleMatrixCanvas.jsx';
import LiveTickerBar from './components/LiveTickerBar.jsx';
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
      setErrorMessage(`Failed to connect to backend: ${err.message}. Ensure FastAPI is running on port 8000.`);
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
    <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
      {/* React Bits Interactive Particle Matrix Background */}
      <ParticleMatrixCanvas particleCount={70} speed={0.4} />

      <LiveTickerBar />
      <Navbar backendUrl={BACKEND_URL} />

      <main className="dashboard-main">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1.3rem',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span>⚠️ {errorMessage}</span>
              <button
                onClick={() => setErrorMessage('')}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="dashboard-grid">
          {/* Left Navigation Console */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
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
          </motion.div>

          {/* Right Dashboard Visualization Column */}
          <motion.div
            className="right-column"
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="cards-grid">
              <TrafficPredictionCard data={predictionData} weather={weather} hour={hour} />
              <RouteMapCard data={routeData} hour={hour} />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
