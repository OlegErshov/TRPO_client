import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getUserStats } from '../api';

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // State for toggling detailed info
  const token = localStorage.getItem('token');

  // Custom marker icon
  const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  L.Marker.prototype.options.icon = defaultIcon;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats(token);
        setStats(data.stats);
        setTotalScans(data.stats.length);

        // Group data by hour
        const groupedByHour = data.stats.reduce((acc, stat) => {
          const scanTime = new Date(stat.scan_time);
          const hour = `${scanTime.getHours()}:00`;
          acc[hour] = (acc[hour] || 0) + 1;
          return acc;
        }, {});

        console.log("Grouped Data by Hour:", groupedByHour); // Log the grouped data to check its structure

        // Create chart data for all 24 hours, even if some hours have no data
        const chartDataFormatted = Array.from({ length: 24 }, (_, i) => {
          const hour = `${i}:00`;
          return {
            hour,
            scans: groupedByHour[hour] || 0,
          };
        });

        console.log("Formatted Chart Data:", chartDataFormatted); // Log the formatted chart data

        setChartData(chartDataFormatted);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="stats-container">
      <div className="stats-wrapper">
        {/* QR Code with Button */}
        <div className="qr-section">
          <img
            alt="QR Code"
            className="qr-code-image"
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${stats[0]?.qr_code_id || 'default-data'}&size=150x150`}
          />
          <button className="toggle-button" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Toggleable Detailed Information */}
        {showDetails && (
          <>
            <p className="total-scans">Total Scans: {totalScans}</p>
            {stats.length > 0 ? (
              <ul className="stats-list">
                {stats.map((stat, idx) => (
                  <li key={idx} className="stats-item">
                    <span className="label">QR Code ID:</span> {stat.qr_code_id}
                    <br />
                    <span className="label">Time:</span> {stat.scan_time}
                    <br />
                    <span className="label">Location:</span> {stat.location}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-stats">No stats available.</p>
            )}
          </>
        )}

        {/* Map & Chart Container */}
        <div className="map-chart-container">
          {/* Map */}
          <div className="map-container">
            <MapContainer
              center={[51.505, -0.09]} // Default center
              zoom={2} // Default zoom level
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {stats.map((stat, idx) => {
                const [lat, lon] = stat.location.split(',').map(coord => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lon)) {
                  return (
                    <Marker key={idx} position={[lat, lon]}>
                      <Popup>
                        <strong>QR Code ID:</strong> {stat.qr_code_id}
                        <br />
                        <strong>Time:</strong> {stat.scan_time}
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}
            </MapContainer>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="chart-container">
              <BarChart
                width={600}
                height={300}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scans" fill="#82ca9d" />
              </BarChart>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .stats-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f4;
          padding: 20px;
        }

        .stats-wrapper {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 800px;
          text-align: center;
        }

        .qr-section {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .qr-code-image {
          max-width: 100px;
          margin-right: 20px;
        }

        .toggle-button {
          padding: 10px;
          background-color: #82ca9d;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .toggle-button:hover {
          background-color: #69b87e;
        }

        .total-scans {
          font-size: 1.2em;
          margin-bottom: 20px;
          font-weight: bold;
          color: #555;
        }

        .stats-list {
          list-style-type: none;
          padding: 0;
          margin-top: 20px;
        }

        .stats-item {
          background-color: #f9f9f9;
          margin: 10px 0;
          padding: 15px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .label {
          font-weight: bold;
          color: #333;
        }

        .no-stats {
          color: #888;
          font-style: italic;
        }

        .map-chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
          width: 100%;
          border-top: 1px solid #ddd; /* Border between map and chart */
          padding-top: 20px;
        }

        .map-container {
          width: 100%;
          height: 400px;
          margin-bottom: 20px;
          border: 1px solid #ddd; /* Border around the map */
        }

        .chart-container {
          width: 100%;
          max-width: 800px;
          margin-top: 20px;
          border: 1px solid #ddd; /* Border around the chart */
          padding: 10px;
        }

        @media (max-width: 768px) {
          .stats-wrapper {
            padding: 15px;
            max-width: 100%;
          }

          .qr-code-image {
            max-width: 80px;
          }

          .toggle-button {
            font-size: 12px;
          }

          .total-scans {
            font-size: 1em;
          }

          .chart-container {
            width: 100%;
            padding: 10px;
          }

          .map-container {
            height: 250px;
          }

          .map-chart-container {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Stats;
