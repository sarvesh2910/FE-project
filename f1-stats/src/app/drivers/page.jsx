"use client"; // This is a client component
import React, { useState, useEffect } from 'react';

function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      if (yearFilter.length === 4) {
        try {
          setLoading(true);
          const response = await fetch(`http://ergast.com/api/f1/${yearFilter}/drivers.json`);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          setDrivers(data.MRData.DriverTable.Drivers);
        } catch (error) {
          setError('Failed to load drivers. Please check the year.');
        } finally {
          setLoading(false);
        }
      } else {
        setDrivers([]);
        setError(null);
      }
    };

    fetchDrivers();
  }, [yearFilter]);

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
  };

  const filteredDrivers = drivers.filter((driver) => 
    `${driver.givenName} ${driver.familyName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading drivers...</p>;
  if (error) return <p>{error}</p>;


    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-6 col-md-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter year"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                    />
                </div>
                <div className="col-6 col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a driver"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {loading && <p>Loading drivers...</p>}
            {error && <p>{error}</p>}
            {!loading && yearFilter.length === 4 && (
                <div className="row">
                    <div className="col">
                        <h2>F1 Drivers in {yearFilter}</h2>
                        <ul className="list-group">
                            {filteredDrivers.map(driver => (
                                <li 
                                    key={driver.driverId} 
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleDriverClick(driver)}>
                                    {driver.givenName} {driver.familyName}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {selectedDriver && (
                <div className="row mt-3">
                    <div className="col">
                        <h3>Driver Details</h3>
                        <p>Name: {selectedDriver.givenName} {selectedDriver.familyName}</p>
                        {/* Additional driver details can be added here */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DriversList;
