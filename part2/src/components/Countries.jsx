import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY // Uses your .env file

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
  }, [])

  const matches = query
    ? countries.filter(c => c.name.common.toLowerCase().includes(query.toLowerCase()))
    : []

  const countryToShow = matches.length === 1 ? matches[0] : selectedCountry

useEffect(() => {
  if (countryToShow && countryToShow.capital) {
    const capital = countryToShow.capital[0]
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('Weather currently unavailable - API key activating')
      })
  }
}, [countryToShow, api_key])
  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  return (
    <div style={{ padding: '20px' }}>
      find countries <input value={query} onChange={handleQueryChange} />
      
      <div style={{ marginTop: '20px' }}>
        {selectedCountry ? (
          <div>
            <h1>{selectedCountry.name.common}</h1>
            <p>capital {selectedCountry.capital[0]}</p>
            <p>area {selectedCountry.area}</p>
            <h3>languages:</h3>
            <ul>
              {Object.values(selectedCountry.languages).map(l => <li key={l}>{l}</li>)}
            </ul>
            <img src={selectedCountry.flags.png} width="150" alt="flag" />
            
            {weather && (
              <div>
                <h2>Weather in {selectedCountry.capital[0]}</h2>
                <p>temperature {weather.main.temp} Celsius</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
                <p>wind {weather.wind.speed} m/s</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {matches.length > 10 && <p>Too many matches, specify another filter</p>}
            {matches.length <= 10 && matches.length > 1 && (
              matches.map(c => (
                <div key={c.cca3}>
                  {c.name.common} <button onClick={() => setSelectedCountry(c)}>show</button>
                </div>
              ))
            )}
            {matches.length === 1 && (
              <div>
                <h1>{matches[0].name.common}</h1>
                <p>capital {matches[0].capital[0]}</p>
                <img src={matches[0].flags.png} width="150" alt="flag" />
                {weather && (
                  <div>
                    <h2>Weather in {matches[0].capital[0]}</h2>
                    <p>temperature {weather.main.temp} Celsius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" />
                    <p>wind {weather.wind.speed} m/s</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Countries