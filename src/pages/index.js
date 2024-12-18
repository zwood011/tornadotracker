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
  const [tornadoAlerts, setTornadoAlerts] = useState({
    alert0: { certainty: '', headline: '', description: '', severity: '', status: '' },
    alert1: { certainty: '', headline: '', description: '', severity: '', status: '' },
    alert2: { certainty: '', headline: '', description: '', severity: '', status: '' }
  });

  //! My steps for completing the full baseline to this project:
  //* Step 1: gather initial baseline material. Find timezones, location info, and names.
  // Step one finished
  //* Step 2: Use info gathered in the initial baseline to use in the same, or an external, api to check if a tornado /alert is ACTIVE
  // Step 2 is active, now find whatever tornado alerts are labeled at on the google api site
  //* Step 3: If active, FIND A WAY TO TRACK IT.. :)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Convert ZIP code to coordinates
      const geocodingResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: zipCodeInput,
            key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const location = geocodingResponse.data.results[0]?.geometry.location;
      if (!location) throw new Error('Invalid ZIP code.');

      const { lat, lng } = location;

      // Step 2: Fetch zones data
      const zonesResponse = await axios.post('/api/fetch-zones', { lat, lng });
      setResult(zonesResponse.data);

      // Step 3: Fetch alerts data
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
      // Automatically update area info and show it
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
      setTornadoAlerts({
        alert0: {
          certainty: tornadoResult?.alerts?.[0]?.properties?.certainty || '',
          headline: tornadoResult?.alerts?.[0]?.properties?.headline || '',
          description: tornadoResult?.alerts?.[0]?.properties?.description || '',
          severity: tornadoResult?.alerts?.[0]?.properties?.severity || '',
          status: tornadoResult?.alerts?.[0]?.properties?.status || '',
        },
        alert1: {
          certainty: tornadoResult?.alerts?.[1]?.properties?.certainty || '',
          headline: tornadoResult?.alerts?.[1]?.properties?.headline || '',
          description: tornadoResult?.alerts?.[1]?.properties?.description || '',
          severity: tornadoResult?.alerts?.[1]?.properties?.severity || '',
          status: tornadoResult?.alerts?.[1]?.properties?.status || '',
        },
        alert2: {
          certainty: tornadoResult?.alerts?.[2]?.properties?.certainty || '',
          headline: tornadoResult?.alerts?.[2]?.properties?.headline || '',
          description: tornadoResult?.alerts?.[2]?.properties?.description || '',
          severity: tornadoResult?.alerts?.[2]?.properties?.severity || '',
          status: tornadoResult?.alerts?.[2]?.properties?.status || '',
        },
      });
    }
  }, [tornadoResult])

  const alertHandler = () => {
    console.log(tornadoAlerts);
  }

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

        {tornadoAlerts && (
          <button onClick={alertHandler}>Show Alerts</button>
        )}

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