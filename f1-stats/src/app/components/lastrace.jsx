'use client'
import { React, useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import style from './lastrace.module.css';

const LastRace = () => {
    // Initialize state settings
    let [loading, setLoading] = useState(true);
    const [circuit, setCircuit] = useState({circuitName: '', url: ''});
    const [circuitCoordinates, setCircuitCoordinates] = useState({lat: '', lon: ''});
    const [pageProps, setPageProps] = useState({desc: ''});
    const circuitUrl = `https://ergast.com/api/f1/current.json`;

    // Set default values for Google Maps
    const defaultProps = {
        center: {
          lat: 45.512778,
          lng: -122.685278
        },
        zoom: 14
      };

    // Fetch description data from Wikipedia asynchronously
    const getWikiData = async function fetchWikiDataFromURL(endpoint) {
        try {
            const response = await fetch(endpoint);

            // Now turn data into a json readable format
            const data = await response.json();

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
    
    // Fetch circuit data from Ergast API asyncronously
    const getCircuitData = async function fetchCircuitDataFromURL(endpoint) {
        try {
            const response = await fetch(endpoint);

            // Now turn data into a json readable format
            const data = await response.json();
            const races = data['MRData']['RaceTable']['Races'];

            const circuit = races[races.length - 1]['Circuit'];

            // Set state values from result
            setCircuit(circuit);
            setCircuitCoordinates(prevState => ({
                ...prevState,
                lat: parseFloat(circuit['Location']['lat']),
                lon: parseFloat(circuit['Location']['long'])
            }));

            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${circuit['circuitName']}&origin=*&format=json`
            
            // Now call on wiki fetch function once we have our URL built
            getWikiData(wikiUrl);
        } catch (error) {
            // Error from API fetch
            console.error('Request failed', error);
        }
    };

    // Render circuit location marker on the embedded Google Map
    const renderMarkers = (map, maps) => {
        let marker = new maps.Marker({
        position: { lat: circuitCoordinates.lat, lng: circuitCoordinates.lon },
        map,
        title: 'Circuit Location'
        });
        return marker;
    };

    useEffect(() => {
        getCircuitData(circuitUrl).then(setTimeout(() => {
            setLoading(false);
          }, "1000"));
    }, []);

    return (
            <div className={style.lastRaceContainer}>
                {loading && <p>Loading...</p>}

                {!loading &&
                    <>
                        <h2>Most Recent Race: </h2>
                        <div className={style.lastRace}>
                            <div className="row">
                                <div className="col-lg-4 col-md-6">
                                    <h3>{circuit.circuitName}</h3>
                                    <p>{pageProps.desc}</p>
                                    <a href={circuit.url} target='_blank'>View on Wikipedia</a>
                                </div>
                                <div className="col-lg-8 col-md-6">
                                    <div style={{ height: '30vh', width: '100%' }}>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: process.env.GOOGLE_API_KEY}}
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
                            </div>
                        </div>
                    </>
                }
            </div>
    );
};

export default LastRace;

