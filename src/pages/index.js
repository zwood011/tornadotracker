import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function TornadoTracker() {
  // Tracks the input for ZIP code
  const [zipCodeInput, setZipCodeInput] = useState('');

  // Stores the results obtained from the ZIP code input
  const [result, setResult] = useState(null);

  // Stores detailed area information based on the ZIP code
  const [areaInfo, setAreaInfo] = useState({ county: '', state: '', classOne: '', classTwo: '', timeZone: '' });
  const [areaShow, setAreaShow] = useState(false);

  // Stores the results of tornado alerts based on location
  const [tornadoResult, setTornadoResult] = useState(null);
  const [tornadoAlerts, setTornadoAlerts] = useState([]);

  // Stores error messages for handling errors
  const [error, setError] = useState(null);

  //! Steps to complete the tornado tracking baseline:
  //* Step 1: Gather basic information such as timezones, location data, and names.
  // Step 1 completed successfully
  //* Step 2: Identify if there is an active tornado alert
  // Step 2 completed successfully
  //* Step 3: For active alerts, track the tornado using collected information
  /*  Using the NOAA (National Oceanic and Atmospheric Administration) Weather API for real-time tornado data including:
    - Current tornado locations
    - Storm path predictions
    - Storm track coordinates
*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fetch location information using Google's Geocoding API
      const { data: { results } } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: zipCodeInput, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
      });

      // Extract location data
      const location = results[0]?.geometry.location;
      if (!location) throw new Error('Invalid ZIP code.');

      const { lat, lng } = location;

      // Fetch area zone information using the latitude and longitude
      const zonesResponse = await axios.post('/api/fetch-zones', { lat, lng });
      setResult(zonesResponse.data);

      // Fetch tornado alerts using the latitude and longitude
      const alertsResponse = await axios.post('/api/alerts', { lat, lng });
      setTornadoResult(alertsResponse.data);

      // Clear any existing errors
      setError(null);
    } catch (err) {
      // Handle any errors that occur during the fetch operations
      setError(err.response?.data?.message || err.message || 'Error fetching data');
      setResult(null); // Reset result on error
    }
  };

  useEffect(() => {
    // Update area information when the result is available
    if (result) {
      setAreaInfo({
        county: result.features[0]?.properties?.name || null,
        state: result.features[0]?.properties?.state || null,
        classOne: result.features[1]?.properties?.name || null,
        classTwo: result.features[2]?.properties?.name || null,
        timeZone: result.features[0]?.properties?.timeZone?.[0] || null,
      });
      setAreaShow(true); // Show the area information
    }
  }, [result]);

  useEffect(() => {
    // Update tornado alerts when the tornado result is available
    if (tornadoResult) {
      if (tornadoResult.alerts?.length > 0) {
        setTornadoAlerts(tornadoResult.alerts.map(alert => ({
          certainty: alert?.properties?.certainty || null,
          headline: alert?.properties?.headline || null,
          description: alert?.properties?.description || null,
          severity: alert?.properties?.severity || null,
          status: alert?.properties?.status || null,
        })));
      } else {
        setTornadoAlerts(null); // No alerts available
      }
    }
  }, [tornadoResult]);

  return (
    <>
      <Head>
        <title>Tracker</title>
      </Head>

      <div className="page-container">
        <h1 className="main-element">Tracker Baseline</h1>
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

        <div className="recent-alerts">
          {areaShow && (
            <div className="area-container">
              <ol className="area-list main-element">
                <strong className="main-element">
                  <li className="main-element">{`${areaInfo.state}, ${areaInfo.county}`}</li>
                  <li className="main-element">{areaInfo.timeZone} Time Zone</li>
                  <li className="main-element">Area Class: {areaInfo.classOne}</li>
                  <li className="main-element">Area Class: {areaInfo.classTwo}</li>
                </strong>
              </ol>
              <p className="main-element">If there is no specific classification, the classes will be marked as the county name by default</p>
            </div>
          )}

          {tornadoAlerts && (
            <div className="alerts-container main-element">
              <ul className="alerts-list">
                {tornadoAlerts.map((alert, index) => (
                  <li key={index}>
                    <h3 className="main-element">{alert.headline}</h3>
                    <p className="main-element">{alert.description}</p>
                    <p className="main-element">Severity: {alert.severity}</p>
                    <p className="main-element">Status: {alert.status}</p>
                    <p className="main-element">Certainty: {alert.certainty}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </>
  );
}