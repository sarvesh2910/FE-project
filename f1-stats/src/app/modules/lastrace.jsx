'use client'
import { React, useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const LastRace = () => {

    const [circuit, setCircuit] = useState({circuitName: '', url: ''});
    const [circuitCoordinates, setCircuitCoordinates] = useState({lat: '', lon: ''});
    const [pageProps, setPageProps] = useState({desc: ''});
    const circuitUrl = `https://ergast.com/api/f1/current.json`;

    const defaultProps = {
        center: {
          lat: 45.512778,
          lng: -122.685278
        },
        zoom: 14
      };

    const getWikiData = async function fetchWikiDataFromURL(endpoint) {
        console.log(endpoint);
        try {
            const response = await fetch(endpoint);

            // Now turn data into a json readable format
            const data = await response.json();

            console.log(data['query']['pages'][Object.keys(data['query']['pages'])[0]]['pageprops']['wikibase-shortdesc']);
            setPageProps(
                prevState => ({
                ...prevState,
                desc: data['query']['pages'][Object.keys(data['query']['pages'])[0]]['pageprops']['wikibase-shortdesc'],
                })
            );

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

            const circuit = races[races.length - 1]['Circuit'];

            setCircuit(circuit);

            setCircuitCoordinates(prevState => ({
                ...prevState,
                lat: parseFloat(circuit['Location']['lat']),
                lon: parseFloat(circuit['Location']['long'])
            }));

            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${circuit['circuitName']}&origin=*&format=json`
            getWikiData(wikiUrl);

        } catch (error) {
            // Error from API fetch
            console.error('Request failed', error);
        }
    };

    const renderMarkers = (map, maps) => {
        let marker = new maps.Marker({
        position: { lat: circuitCoordinates.lat, lng: circuitCoordinates.lon },
        map,
        title: 'Circuit Location'
        });
        return marker;
    };

    useEffect(() => {
        getCircuitData(circuitUrl);
    }, []);

    return (
            <div className='next-race-container'>
                <h2>Most Recent Race: </h2>
                <div class='next-race'>
                    <div className="row">
                        <div className="col-md-4">
                            <h3>{circuit.circuitName}</h3>
                            <p>{pageProps.desc}</p>
                            <a href={circuit.url} target='_blank'>View on Wikipedia</a>
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
                                    yesIWantToUseGoogleMapApiInternals
                                    onGoogleApiLoaded={({ map, maps }) => renderMarkers(map, maps)}
                                >
                                    
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

export default LastRace;

