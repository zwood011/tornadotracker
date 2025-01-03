import { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';

import Areas from '../components/areas';
import Alerts from '../components/alerts';
import Header from '../components/header';

export default function TornadoTracker() {
  const [zipCode, setZipCode] = useState('');
  const [result, setResult] = useState(null);
  const [tornadoResult, setTornadoResult] = useState(null);
  const [error, setError] = useState(null);

  const handleZipCode = (zipCode) => {
    setZipCode(zipCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { results } } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address: zipCode, key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY }
      });

      const location = results[0]?.geometry.location;
      if (!location) throw new Error('Invalid ZIP code.');
      const { lat, lng } = location;

      const zonesResponse = await axios.post('/api/fetch-zones', { lat, lng });
      setResult(zonesResponse.data);

      const alertsResponse = await axios.post('/api/alerts', { lat, lng });
      setTornadoResult(alertsResponse.data);

      setError(null);
    } catch (err) {
      if (err.status === 400) { setError('Invalid ZIP code.') }
      else {
        setError(err.message || 'Error fetching data');
      }
      setResult(null);
      setTornadoResult(null);
    }
    setZipCode('');
  };

  return (
    <>
      <Head>
        <title>Tracker</title>
      </Head>

      <div className="page-container">
        <Header handleSubmit={handleSubmit} handleZipCode={handleZipCode} zipCode={zipCode} />

        {result && (
          <main className="main-container">
            <Areas result={result} />
            {tornadoResult && <Alerts result={tornadoResult} />}
          </main>
        )}

        {error && <div className="main-element" style={{ color: 'red' }}><strong>{error}</strong></div>}
      </div>
    </>
  );
}
