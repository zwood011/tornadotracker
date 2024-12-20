import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Areas from './areas';
import Alerts from './alerts';

export default function TornadoTracker() {
  const [zipCodeInput, setZipCodeInput] = useState('');
  const [result, setResult] = useState(null);
  const [tornadoResult, setTornadoResult] = useState(null);
  const [error, setError] = useState(null);

  /*  Try using the NOAA (National Oceanic and Atmospheric Administration) Weather API for real-time tornado data including:
    - Current tornado locations
    - Storm path predictions
    - Storm track coordinates
*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find lat/lng w/ Google's Geocoding API
      const { data: { results } } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: zipCodeInput, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
      });

      // Extract
      const location = results[0]?.geometry.location;
      if (!location) throw new Error('Invalid ZIP code.');
      const { lat, lng } = location; // Assign

      // Fetch weather.api info using assigned lat/lng as the required parameters
      const zonesResponse = await axios.post('/api/fetch-zones', { lat, lng });
      setResult(zonesResponse.data);

      // Fetch tornado alerts using the latitude and longitude
      const alertsResponse = await axios.post('/api/alerts', { lat, lng });
      setTornadoResult(alertsResponse.data);

      // Clear
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching data');
      setResult(null);
    }
  };


  return (
    <>
      <Head>
        <title>Tracker</title>
      </Head>

      <div className="page-container">
        <header className="page-header">
          <div className="header-titles">
            <h1 className="main-element">Tracker Baseline</h1>
            <p className="main-element">Enter a ZIP code to fetch area information and tornado alerts</p>
          </div>

          <form onSubmit={handleSubmit} className="main-element form-container">
            <div className="form-items">
              <label>Zip Code: </label>
              <input
                type="text"
                value={zipCodeInput}
                onChange={(e) => setZipCodeInput(e.target.value)}
                required
              />
            </div>
            <button type="submit">Fetch Area Info</button>
          </form>
        </header>

        {result && (
          <Areas result={result} />
        )}

        {tornadoResult && (
          <Alerts result={tornadoResult} />
        )}

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </>
  );
}