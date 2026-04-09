import React, { useState, useEffect } from "react";
import Axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { FiThermometer, FiDroplet, FiWind, FiCloud, FiMapPin } from "react-icons/fi";
import "./WeatherReport.css";

// Helper component to update map view when coordinates change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

ChangeView.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
};

function LocationMarker({ setLat, setLon, onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLat(e.latlng.lat);
      setLon(e.latlng.lng);
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  );
}

LocationMarker.propTypes = {
  setLat: PropTypes.func.isRequired,
  setLon: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};

export default function WeatherReport() {
  const [place, setPlace] = useState("");
  const [lat, setLat] = useState(16.7193); // Default (near Tadepalligudem)
  const [lon, setLon] = useState(81.7360);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (laititude, longitude, customName = null) => {
    setLoading(true);
    try {
      const res = await Axios.get("http://127.0.0.1:5000/weatherRoute/get-weather", {
        params: { lat: laititude, lon: longitude },
      });
      setWeather(res.data);
      setError("");
      setSuccess(`Weather for ${customName || res.data.name} loaded!`);
    } catch (err) {
      setError("Failed to fetch weather data");
      setWeather(null);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const findOnMap = async () => {
    if (!place) return;
    try {
      const res = await Axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      if (res.data && res.data.length > 0) {
        const newLat = parseFloat(res.data[0].lat);
        const newLon = parseFloat(res.data[0].lon);
        setLat(newLat);
        setLon(newLon);
        setError("");
        fetchWeather(newLat, newLon, res.data[0].display_name); // Auto-fetch weather
      } else {
        setError("Place not found");
        setSuccess("");
      }
    } catch {
      setError("Error finding place");
      setSuccess("");
    }
  };

  const handleMapClick = async (newLat, newLon) => {
    // Reverse Geocode (lat/lon to name)
    try {
      const res = await Axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLat}&lon=${newLon}`
      );
      if (res.data && res.data.display_name) {
        setPlace(res.data.display_name); // Update the search box
        fetchWeather(newLat, newLon, res.data.display_name);
      } else {
        fetchWeather(newLat, newLon); // Fallback to OWM name
      }
    } catch (err) {
      console.warn("Reverse Geocoding Error:", err);
      fetchWeather(newLat, newLon); // Fallback
    }
  };

  return (
    <div className="weather-container">
      <div className="weather-content-wrapper">
        <div className="weather-title-box">
          <h2 className="weather-title">Weather Report</h2>
        </div>

        <div className="weather-layout-grid">
          {/* Left Column: Map and Search */}
          <div className="weather-column left-column">
            <div className="map-wrapper">
              <MapContainer
                center={[lat, lon]}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", borderRadius: "20px" }}
              >
                <ChangeView center={[lat, lon]} zoom={11} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker setLat={setLat} setLon={setLon} onSelect={handleMapClick} />
              </MapContainer>
            </div>

            <div className="search-section">
              <input
                type="text"
                value={place}
                onChange={e => setPlace(e.target.value)}
                placeholder="Search for a city..."
                className="weather-input"
                onKeyDown={(e) => e.key === 'Enter' && findOnMap()}
              />
              <button className="weather-btn find-btn" onClick={findOnMap}>Search</button>
            </div>

            <p className="instruction-text">Or click anywhere on the map</p>

            <div className="coordinates-display">
              <span>Lat: {lat.toFixed(4)}</span>
              <span>Lon: {lon.toFixed(4)}</span>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="weather-column right-column">
            {error && <div className="weather-error">{error}</div>}
            {success && <div className="weather-success">{success}</div>}
            {loading && <div style={{ color: "white", textAlign: "center", padding: "20px" }}>Fetching weather data...</div>}

            {weather && !loading && (
              <div className="weather-result-card">
                <div className="weather-header">
                  <FiMapPin className="weather-location-icon" />
                  <h3>{weather.name}, {weather.sys.country}</h3>
                </div>
                
                <div className="weather-main-display">
                  <div className="weather-temp-large">
                    <FiThermometer className="weather-main-icon" />
                    <span>{Math.round(weather.main.temp)}°C</span>
                  </div>
                  <div className="weather-condition capitalize">
                    <FiCloud className="weather-condition-icon" />
                    <span>{weather.weather[0].description}</span>
                  </div>
                </div>

                <div className="weather-grid">
                  <div className="weather-item">
                    <div className="weather-item-icon humidity-icon">
                      <FiDroplet />
                    </div>
                    <div className="weather-item-info">
                      <span className="label">Humidity</span>
                      <span className="value">{weather.main.humidity}%</span>
                    </div>
                  </div>
                  <div className="weather-item">
                    <div className="weather-item-icon wind-icon">
                      <FiWind />
                    </div>
                    <div className="weather-item-info">
                      <span className="label">Wind Speed</span>
                      <span className="value">{weather.wind.speed} m/s</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!weather && !loading && !error && (
              <div className="weather-placeholder">
                <p>Select a location to see the weather details here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}