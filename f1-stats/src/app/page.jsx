'use client'
import { React, useState, useEffect } from 'react';
import Image from 'next/image'
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = () => <div className='marker'><img src={'/checkered-flag.png'} /></div>;

const Home = () => {
    const [circuit, setCircuit] = useState({circuitName: '', url: ''});
    const [circuitCoordinates, setCircuitCoordinates] = useState({lat: '', lon: ''});
    const circuitUrl = `https://ergast.com/api/f1/current.json`;

    const defaultProps = {
        center: {
          lat: 10.99835602,
          lng: 77.01502627
        },
        zoom: 14
      };

    const getCoordinateData = async function fetchCoordinateDataFromURL(endpoint) {
        console.log(endpoint);
        try {
            const response = await fetch(endpoint);

            // Now turn data into a json readable format
            const data = await response.json();
            console.log(data);
            console.log(data['query']['pages'][Object.keys(data['query']['pages'])[0]]['coordinates'][0]);
            setCircuitCoordinates(data['query']['pages'][Object.keys(data['query']['pages'])[0]]['coordinates'][0])

        } catch (error) {
            // Error from API fetch
            console.error('Request failed', error);
        } 
    }
    
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
            const circuitName = races[races.length - 1]['Circuit']['circuitName'];

            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=${circuitName}&origin=*&format=json`
            getCoordinateData(wikiUrl);

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
                        <p>Lat: {circuitCoordinates.lat}</p>
                        <p>Lon: {circuitCoordinates.lon}</p>
                    </div>
                    <div className="col-md-4">
                        <div style={{ height: '30vh', width: '100%' }}>
                            <GoogleMapReact
                                bootstrapURLKeys={{ key: "AIzaSyCPxaLwQ3MLzMdWYD4yK0xgGbh5xBFhkJw" }}
                                defaultCenter={defaultProps.center}
                                defaultZoom={defaultProps.zoom}
                                center={[
                                    circuitCoordinates.lat,
                                    circuitCoordinates.lon
                                ]}
                            >
                                <AnyReactComponent
                                lat={circuitCoordinates.lat}
                                lng={circuitCoordinates.lon}
                                text="My Marker"
                                />
                            </GoogleMapReact>
                        </div>
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

