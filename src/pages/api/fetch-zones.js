import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { lat, lng } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const userAgent = '(myweatherapp.com, contact@myweatherapp.com)';
    const zonesResponse = await axios.get(`https://api.weather.gov/zones`, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'application/geo+json',
      },
      params: {
        point: `${lat},${lng}`,
      },
    });

    res.status(200).json(zonesResponse.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json({ message: error.response?.data?.message || 'Failed to fetch data' });
  }
}
