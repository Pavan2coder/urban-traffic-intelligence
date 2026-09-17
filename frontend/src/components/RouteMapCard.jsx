import React, { useEffect, useState } from 'react';
import { Map, Navigation, Clock, Calendar, ArrowRight, Route as RouteIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet Default Marker Icon Assets
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Colored Pins
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="
      background-color: ${color};
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 10px ${color};
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const startIcon = createCustomIcon('#10b981');
const endIcon = createCustomIcon('#ef4444');

// Helper to auto-recenter map when path coordinates update
function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [coords, map]);
  return null;
}

export default function RouteMapCard({ data, hour }) {
  if (!data) {
    return (
      <div className="glass-panel">
        <div className="card-header">
          <h3 className="card-title">
            <RouteIcon size={18} style={{ color: '#06b6d4' }} />
            Route Optimization & Map View
          </h3>
        </div>
        <div className="card-body">
          <div className="placeholder-box">
            <div className="placeholder-icon">🗺️</div>
            <p style={{ fontWeight: 500 }}>No route calculated yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Select source & destination, then click <strong>Find Best Route</strong> in the sidebar.</p>
          </div>
        </div>
      </div>
    );
  }

  const pathCoords = data.path_coords || [];
  const distance = data.total_distance || 0;
  const minutes = data.estimated_minutes || 0;
  const waypoints = data.best_route || [];

  // Depart & Arrival Time Math
  const formatTime = (h, extraMins = 0) => {
    const totalMinutes = h * 60 + extraMins;
    const finalH = Math.floor(totalMinutes / 60) % 24;
    const finalM = Math.floor(totalMinutes % 60);
    const period = finalH >= 12 ? 'PM' : 'AM';
    const displayH = finalH % 12 === 0 ? 12 : finalH % 12;
    const displayM = finalM < 10 ? `0${finalM}` : finalM;
    return `${displayH}:${displayM} ${period}`;
  };

  const departStr = formatTime(hour, 0);
  const arriveStr = formatTime(hour, minutes);
  const centerLoc = pathCoords.length > 0 ? pathCoords[0] : [17.3850, 78.4867]; // Hyderabad default

  return (
    <div className="glass-panel">
      <div className="card-header">
        <h3 className="card-title">
          <RouteIcon size={18} style={{ color: '#06b6d4' }} />
          Route Optimization & Interactive Map
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#10b981', padding: '0.2rem 0.6rem', background: 'rgba(16,185,129,0.1)', borderRadius: '12px' }}>
          Dijkstra Shortest Path
        </span>
      </div>

      <div className="card-body">
        {/* Route Summary Box */}
        <div className="route-summary-box">
          <div className="summary-item">
            <span className="summary-val">{distance} km</span>
            <span className="summary-lbl">Total Distance</span>
          </div>
          <div className="summary-item">
            <span className="summary-val" style={{ color: '#f59e0b' }}>{minutes} mins</span>
            <span className="summary-lbl">Travel Duration</span>
          </div>
          <div className="summary-item">
            <span className="summary-val" style={{ color: '#10b981' }}>{arriveStr}</span>
            <span className="summary-lbl">Est. Arrival (ETA)</span>
          </div>
        </div>

        {/* Departure & Arrival Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} style={{ color: '#a5b4fc' }} />
            <span>Depart: <strong style={{ color: '#fff' }}>{departStr}</strong></span>
          </div>
          <ArrowRight size={16} style={{ color: '#6366f1' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} style={{ color: '#34d399' }} />
            <span>Arrive: <strong style={{ color: '#34d399' }}>{arriveStr}</strong></span>
          </div>
        </div>

        {/* Leaflet Interactive Map */}
        {pathCoords.length > 0 && (
          <MapContainer
            center={centerLoc}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '360px', borderRadius: 'var(--radius-md)' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapRecenter coords={pathCoords} />
            
            {/* Start Marker */}
            <Marker position={pathCoords[0]} icon={startIcon}>
              <Popup>
                <strong>Start:</strong> {waypoints[0]}
              </Popup>
            </Marker>

            {/* Destination Marker */}
            <Marker position={pathCoords[pathCoords.length - 1]} icon={endIcon}>
              <Popup>
                <strong>Destination:</strong> {waypoints[waypoints.length - 1]}
              </Popup>
            </Marker>

            {/* Path Polyline */}
            <Polyline
              positions={pathCoords}
              color="#6366f1"
              weight={6}
              opacity={0.85}
            />
          </MapContainer>
        )}

        {/* Waypoints List */}
        {waypoints.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.4rem', fontWeight: 600 }}>
              OPTIMAL WAYPOINT TRAJECTORY:
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              alignItems: 'center'
            }}>
              {waypoints.map((wp, idx) => (
                <React.Fragment key={idx}>
                  <span style={{
                    fontSize: '0.78rem',
                    padding: '0.25rem 0.6rem',
                    background: idx === 0 ? 'rgba(16,185,129,0.2)' : idx === waypoints.length - 1 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '6px',
                    color: idx === 0 ? '#34d399' : idx === waypoints.length - 1 ? '#f87171' : 'var(--text-main)'
                  }}>
                    {wp}
                  </span>
                  {idx < waypoints.length - 1 && <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>➔</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
