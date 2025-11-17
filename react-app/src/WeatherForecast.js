import React, { useState, useEffect } from 'react';
import './WeatherForecast.css';

const WeatherForecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Zakopane coordinates
    const latitude = 49.2992;
    const longitude = 19.9496;
    
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Europe/Warsaw`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setForecast(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: '☀️ Słonecznie',
      1: '🌤️ Pogodnie',
      2: '⛅ Częściowo pochmurno',
      3: '☁️ Pochmurno',
      45: '🌫️ Mgła',
      48: '🌫️ Mgła mroźna',
      51: '🌧️ Lekka mżawka',
      53: '🌧️ Mżawka',
      55: '🌧️ Silna mżawka',
      61: '🌧️ Lekki deszcz',
      63: '🌧️ Deszcz',
      65: '🌧️ Silny deszcz',
      71: '🌨️ Lekki śnieg',
      73: '🌨️ Śnieg',
      75: '🌨️ Silny śnieg',
      77: '🌨️ Śnieg ziarnisty',
      80: '🌦️ Przelotne opady',
      81: '🌦️ Przelotne opady',
      82: '⛈️ Silne przelotne opady',
      85: '🌨️ Przelotne śniegi',
      86: '🌨️ Silne przelotne śniegi',
      95: '⛈️ Burza',
      96: '⛈️ Burza z gradem',
      99: '⛈️ Silna burza z gradem'
    };
    return weatherCodes[code] || '🌡️ Brak danych';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayName}, ${day}.${month}`;
  };

  if (loading) {
    return <div className="weather-container"><p className="loading">Ładowanie prognozy pogody...</p></div>;
  }

  if (error) {
    return <div className="weather-container"><p className="error">Błąd: {error}</p></div>;
  }

  return (
    <div className="weather-container">
      <h1>🏔️ Pogoda w Zakopanem</h1>
      <p className="subtitle">Prognoza na najbliższy tydzień</p>
      
      <div className="forecast-grid">
        {forecast.daily.time.slice(0, 7).map((date, index) => (
          <div key={date} className="forecast-card">
            <h3 className="date">{formatDate(date)}</h3>
            <div className="weather-icon">
              {getWeatherDescription(forecast.daily.weathercode[index])}
            </div>
            <div className="temperature">
              <span className="temp-max">{Math.round(forecast.daily.temperature_2m_max[index])}°C</span>
              <span className="temp-separator">/</span>
              <span className="temp-min">{Math.round(forecast.daily.temperature_2m_min[index])}°C</span>
            </div>
            <div className="precipitation">
              💧 {forecast.daily.precipitation_sum[index]} mm
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
