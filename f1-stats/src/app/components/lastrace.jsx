'use client'
import {React, useState, useEffect} from 'react';
import GoogleMapReact from 'google-map-react';
import style from './lastrace.module.css';
import {getRaceResults} from "@/app/api/api";
import {convertTimeToSeconds} from "@/app/races/positionPerLap";

const LastRace = () => {
    // Initialize state settings
    let [loading, setLoading] = useState(true);
    const [circuit, setCircuit] = useState({circuitName: '', url: ''});
    const [circuitCoordinates, setCircuitCoordinates] = useState({lat: '', lon: ''});
    const [pageProps, setPageProps] = useState({desc: ''});
    const [gpName, setGpName] = useState('')
    const circuitUrl = `https://ergast.com/api/f1/current.json`;
    const [circuitLength, setCircuitLength] = useState(null)
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
        console.log(endpoint);
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
            const gpName = races[races.length - 1]['raceName']
            const circuit = races[races.length - 1]['Circuit'];

            // Set state values from result
            setGpName(gpName)
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
            position: {lat: circuitCoordinates.lat, lng: circuitCoordinates.lon},
            map,
            title: 'Circuit Location'
        });
        return marker;
    };

    const getDistance = (timeInSeconds, speedKmph) => {
        const speedMps = speedKmph / 3.6;
        const distanceKM = (timeInSeconds * speedMps) / 1000;
        return distanceKM;
    }
    useEffect(() => {
        (async () => {
            let raceResults = await getRaceResults(2023, 22)
            console.log(raceResults);
            let fl = raceResults?.Races[0]?.Results[0]?.FastestLap
            let length = getDistance(convertTimeToSeconds(fl.Time.time), parseFloat(fl.AverageSpeed.speed))
            setCircuitLength(length)
        })()
        getCircuitData(circuitUrl).then(setTimeout(() => {
            setLoading(false);
        }, "1000"));
    }, []);

    return (
        <div className={style.lastRaceContainer}>
            {loading && <p>Loading...</p>}
            {!loading &&
                <>
                    <h4 className={style.heading}>Most Recent Race: </h4>
                    <div className={style.lastRace}>
                        <div className="row" style={{height: `100%`}}>
                            <div className={`col-lg-4 col-md-6 ${style.circuitInfo}`}>
                                <h2>{gpName}</h2>
                                <h4>{circuit.circuitName}, {circuit.Location.country}</h4>
                                <div>
                                    <p>{pageProps.desc}.</p>
                                    <p>Circuit Length : {circuitLength?.toFixed(2)}KM</p>
                                    <a href={circuit.url} target='_blank'>View on Wikipedia</a>
                                </div>
                            </div>
                            <div className="col-lg-8 col-md-6 gMapContainer">
                                <div style={{height: '100%', width: '100%'}}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{key: process.env.GOOGLE_API_KEY}}
                                        defaultCenter={defaultProps.center}
                                        defaultZoom={defaultProps.zoom}
                                        center={[
                                            circuitCoordinates.lat,
                                            circuitCoordinates.lon
                                        ]}
                                        yesIWantToUseGoogleMapApiInternals
                                        onGoogleApiLoaded={({map, maps}) => renderMarkers(map, maps)}
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

