import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Areas from './areas';
import Alerts from './alerts';
import Header from './header';

export default function TornadoTracker() {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState(null);
  const [tornadoResult, setTornadoResult] = useState(null);
  const [error, setError] = useState(null);

  /*  
  ? Try using the NOAA (National Oceanic and Atmospheric Administration) Weather API for real-time tornado data including:
      - Current tornado locations
      - Storm path predictions
      - Storm track coordinates
  */

  //! This project's data flow is currently bidirectional between this file and header.js, though not complex
  //* SSR/ISR & Redux will be implemented once I have all of the logic in place

  const handleZipCode = (zipCode) => { // Sync changes from header.js to this file
    setZipCode(zipCode);
  };

  // Lifted up from header.js to handle the conditional rendering + api calls found in this file
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find lat/lng w/ Google's Geocoding API
      const { data: { results } } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: zipCode, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
      });

      // Extract
      const location = results[0]?.geometry.location;
      if (!location) throw new Error('Invalid ZIP code.');
      const { lat, lng } = location; // Assign

      // Fetch zone data using the assigned lat/lng 
      const zonesResponse = await axios.post('/api/fetch-zones', { lat, lng });
      setResult(zonesResponse.data);

      // Fetch alert data using the assigned lat/lng
      const alertsResponse = await axios.post('/api/alerts', { lat, lng });
      setTornadoResult(alertsResponse.data);
    } catch (err) {
      // Handle errors
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
        <Header handleSubmit={handleSubmit} handleZipCode={handleZipCode} zipCode={zipCode} />

        {result && (
          <main>
            <Areas result={result} />

            {tornadoResult && (
              <Alerts result={tornadoResult} />
            )}
          </main>
        )}

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </>
  );
}