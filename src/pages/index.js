import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function TornadoTracker() {
  const [zipCodeInput, setZipCodeInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [areaInfo, setAreaInfo] = useState({ county: '', state: '', classOne: '', classTwo: '', timeZone: '' });
  const [areaShow, setAreaShow] = useState(false);
  const [tornadoResult, setTornadoResult] = useState(null);
  const [tornadoAlerts, setTornadoAlerts] = useState([]);

  //! My steps for completing the full baseline to this project:
  //* Step 1: gather initial baseline material. Find timezones, location info, and names.
  // Step one finished
  //* Step 2: Check if a tornado /alert is ACTIVE
  // Step 2 finished
  //* Step 3: If active, find a way to track the tornado using all the information collected in the states

  /*  The NOAA (National Oceanic and Atmospheric Administration) Weather API provides real-time tornado data including:
    - Current tornado locations
    - Storm path predictions
    - Storm track coordinates
*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { results } } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: zipCodeInput, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
      });
      const location = results[0]?.geometry.location;
      if (!location) throw new Error('Invalid ZIP code.');

      const { lat, lng } = location;
      const zonesResponse = await axios.post('/api/fetch-zones', { lat, lng });
      setResult(zonesResponse.data);

      const alertsResponse = await axios.post('/api/alerts', { lat, lng });
      setTornadoResult(alertsResponse.data);

      setError(null); // Clear any existing errors
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error fetching data');
      setResult(null);
    }
  };

  useEffect(() => {
    if (result) {
      setAreaInfo({
        county: result.features[0]?.properties?.name || null,
        state: result.features[0]?.properties?.state || null,
        classOne: result.features[1]?.properties?.name || null,
        classTwo: result.features[2]?.properties?.name || null,
        timeZone: result.features[0]?.properties?.timeZone?.[0] || null,
      });
      setAreaShow(true);
    }
  }, [result]);

  useEffect(() => {
    if (tornadoResult) {
      setTornadoAlerts(tornadoResult.alerts?.map(alert => ({
        certainty: alert?.properties?.certainty || '',
        headline: alert?.properties?.headline || '',
        description: alert?.properties?.description || '',
        severity: alert?.properties?.severity || '',
        status: alert?.properties?.status || '',
      })) || []);
    }
  }, [tornadoResult]);

  return (
    <>
      <Head>
        <title>Tornado Tracker</title>
      </Head>

      <div>
        <h1 className="main-element">Tracker Baseline</h1>

        {areaShow && (
          <div>
            <h2>Areas:</h2>
            <ol>
              <li>{`${areaInfo.state}, ${areaInfo.county}`}</li>
              <li>{areaInfo.timeZone} Time Zone</li>
              <li>Class 1: {areaInfo.classOne}</li>
              <li>Class 2: {areaInfo.classTwo}</li>
            </ol>
            <p>(Classes vary by region. If there is <em>no specific classification</em> labeled within the region, they will be marked as the <strong>original county</strong> by default)</p>
          </div>
        )}

        <button onClick={() => console.log(tornadoAlerts)}>Show Tornado Alerts</button>

        <form onSubmit={handleSubmit} className="main-element">
          <div>
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

        {result && (
          <div className="main-element">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </>
  );
}