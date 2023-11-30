'use client'
import React, { useState, useEffect } from 'react';

function DriversList() {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (yearFilter.length === 4) {
            setLoading(true);
            fetch(`http://ergast.com/api/f1/${yearFilter}/drivers.json`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setDrivers(data.MRData.DriverTable.Drivers);
                    setLoading(false);
                })
                .catch(error => {
                    setError('Failed to load drivers. Please check the year.');
                    setLoading(false);
                });
        } else {
            setDrivers([]);
            setError(null);
        }
    }, [yearFilter]);

    const handleDriverClick = (driver) => {
        setSelectedDriver(driver);
        setSearchQuery(`${driver.givenName} ${driver.familyName}`);
        setShowDropdown(false);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true);
        setSelectedDriver(null); // Clear selected driver when search changes
    };

    const filteredDrivers = drivers.filter(driver =>
        `${driver.givenName} ${driver.familyName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="col-6 col-md-3 position-relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for a driver"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && (
                        <div className="list-group w-100" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1050 }}>
                            {filteredDrivers.map(driver => (
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
            {loading && <p>Loading drivers...</p>}
            {error && <p>{error}</p>}
            {selectedDriver && (
                <div className="row mt-3">
                    <div className="col">
            <h3>Driver Details</h3>
            <p><strong>Name:</strong> {selectedDriver.givenName} {selectedDriver.familyName}</p>
            <p><strong>Date of Birth:</strong> {selectedDriver.dateOfBirth}</p>
            <p><strong>Nationality:</strong> {selectedDriver.nationality}</p>
            <p><strong>Wikipedia:</strong> <a href={selectedDriver.url} >Link</a></p>
        </div>
                </div>
            )}
        </div>
    );
}

export default DriversList;
