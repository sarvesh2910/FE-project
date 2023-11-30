'use client'
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import './styles.css'; 


function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [raceResult, setRaceResult] = useState(null);
  const [driverImage, setDriverImage] = useState(null); // State to store driver's Wikipedia image URL

  useEffect(() => {
    if (yearFilter.length === 4) {
      setLoading(true);
      fetch(`http://ergast.com/api/f1/${yearFilter}/drivers.json`)
        .then((response) => response.json())
        .then((data) => {
          setDrivers(data.MRData.DriverTable.Drivers);
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to load drivers. Please check the year.');
          setLoading(false);
        });
    } else {
      setDrivers([]);
      setError(null);
    }

    if (selectedDriver && yearFilter.length === 4) {
      const lastName = selectedDriver.familyName.toLowerCase();
      fetch(`http://ergast.com/api/f1/${yearFilter}/drivers/${lastName}/results.json`)
        .then((response) => response.json())
        .then((data) => {
          setRaceResult(data.MRData.RaceTable);
        })
        .catch((error) => console.error('Error fetching race results:', error));

      // Fetch driver's Wikipedia page to get the thumbnail image URL
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${selectedDriver.givenName}_${selectedDriver.familyName}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Wikipedia API response:', data); // Add this line for debugging
          if (data.thumbnail && data.thumbnail.source) {
            setDriverImage(data.thumbnail.source);
          } else {
            setDriverImage(null);
          }
        })
        .catch((error) => console.error('Error fetching driver image:', error));
    } else {
      setDriverImage(null);
    }
  }, [yearFilter, selectedDriver]);

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setSearchQuery(`${driver.givenName} ${driver.familyName}`);
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    setSelectedDriver(null);
  };

  const filteredDrivers = drivers.filter((driver) =>
    `${driver.givenName} ${driver.familyName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const prepareChartData = (raceResults) => {
    if (!raceResults || !raceResults.Races || raceResults.Races.length === 0) {
      // No race results, return empty data
      return {
        labels: [],
        datasets: [
          {
            label: 'Points Won',
            data: [],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
    }

    const labels = raceResults.Races.map((race) => `${race.raceName}`);
    const dataPoints = raceResults.Races.map((race) => race.Results[0].points); // Points won from the first result of each race

    return {
      labels,
      datasets: [
        {
          label: 'Points Won',
          data: dataPoints,
          backgroundColor: 'rgb(238, 0, 0)',

        },
      ],
    };
  };

  let chartData = prepareChartData(raceResult);

  return (
    <div className="container">
      {/* Title for F1 Drivers */}
      <div className="row mb-3">
        <div className="col">
          <h2>F1 Drivers</h2>
        </div>
      </div>
      {/* Search bars */}
      <div className="row mb-3">
        {/* Year input */}
        <div className="col-6 col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Enter year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          />
        </div>
        {/* Driver name input */}
        <div className="col-6 col-md-3 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search for a driver"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
          />
          {/* Dropdown for driver search results */}
          {showDropdown && (
            <div
              className="list-group w-100"
              style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1050 }}
            >
              {filteredDrivers.map((driver) => (
                <button
                  type="button"
                  key={driver.driverId}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleDriverClick(driver)}
                >
                  {driver.givenName} {driver.familyName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading and error messages */}
      {loading && <p>Loading drivers...</p>}
      {error && <p>{error}</p>}

      <div className="row">
        {/* Driver image */}
        {driverImage && (
          <div className="col-md-4">
            <img src={driverImage} alt="Driver" className="img-fluid" />
          </div>
        )}

        {/* Driver details */}
        {selectedDriver && (
          <div className="col-md-8">
            <h3>Driver Details</h3>
            <p>
              <strong>Name:</strong> {selectedDriver.givenName} {selectedDriver.familyName}
            </p>
            <p>
              <strong>Date of Birth:</strong> {selectedDriver.dateOfBirth}
            </p>
            <p>
              <strong>Nationality:</strong> {selectedDriver.nationality}
            </p>
            <p>
              <strong>Wikipedia:</strong>{' '}
              <a href={selectedDriver.url} target="_blank" rel="noopener noreferrer">
                Link
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Race results */}
      {raceResult && <Bar data={chartData} />}
      {raceResult && (
        <div > 
          <h3 className="mt-5">Race Results</h3>
          <table>
            <thead>
              <tr>
              
                <th>Year</th>
                <th>Circuit</th>
                <th>Position</th>
                <th>Driver Number</th>
                <th>Constructor</th>
                <th>Laps</th>
                <th>Grid</th>
                <th>Time</th>
                <th>Status</th>
                <th>Points Won</th>
              </tr>
              
            </thead>
            <tbody>
              {raceResult.Races.map((race, index) =>
                race.Results.map((result, idx) => (
                  <tr key={`${index}-${idx}`} >
                    <td>{race.season}</td>
                    <td>{race.raceName}</td>
                    <td>{result.position}</td>
                    <td>{result.number}</td>
                    <td>{result.Constructor.name}</td>
                    <td>{result.laps}</td>
                    <td>{result.grid}</td>
                    <td>{result.Time ? result.Time.time : 'N/A'}</td>
                    <td>{result.status}</td>
                    <td>{result.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
         
        </div>
      )}
    </div>
  );
}

export default DriversList;
