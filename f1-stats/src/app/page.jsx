'use client'
import { React, useState, useEffect } from 'react';

const Home = () => {

    const [circuit, setCircuit] = useState({circuitName: '', url: ''});
    const circuitUrl = `https://ergast.com/api/f1/current.json`;

    // Fetch data from API asyncronously
    const getCircuitData = async function fetchCircuitDataFromURL(endpoint) {
        console.log(endpoint);
        try {
            const response = await fetch(endpoint);

            // Now turn data into a json readable format
            const data = await response.json();
            const races = data['MRData']['RaceTable']['Races'];
            console.log(races);
            console.log(races[races.length - 1]['Circuit']);
            setCircuit(races[races.length - 1]['Circuit']);

        } catch (error) {
            // Error from API fetch
            console.error('Request failed', error);
        }
    };

    useEffect(() => {
        getCircuitData(circuitUrl);
    }, []);

    return (
        <div className='container'>
            <h1></h1>
            <h2>Next Race: </h2>
            <div className="card">
                <div className="row">
                    <div className="col-sm-4">
                        <h2>{circuit.circuitName}</h2>
                        <a href={circuit.url} target='_blank'>View on Wikipedia</a>
                        <p>Content about race</p>
                    </div>
                    <div className="col-md-4">
                        <h2>Map</h2>
                    </div>
                    <div className="col-md-4">
                        <h2>Weather</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

