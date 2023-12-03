'use client'
import React, {useEffect, useState} from "react";
import {getRaceResults, getSeasonRounds, getSeasonsList, getWeather} from '../api/api'
import PositionChart from "@/app/races/positionPerLap";
import style from './races.module.css';
import Podium from "@/app/races/podium";

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {month: 'short', day: '2-digit'};
    return new Intl.DateTimeFormat('en-US', options).format(date);
};


const Races = () => {
    let [loading, setLoading] = useState(true)
    let [seasonsList, setSeasonsList] = useState([])
    let [roundsList, setRoundsList] = useState([])
    let [selectedSeason, setSelectedSeason] = useState("")
    let [selectedRound, setSelectedRound] = useState(null)
    let [weather, setWeather] = useState(null)
    let [raceResult, setRaceResult] = useState(null)
    let [fastestLap, setFastestLap] = useState(null)
    let [podium, setPodium] = useState({})
    let [driverMapping, setDriverMapping] = useState({})

    useEffect(() => {
        (async () => {
            let season = await getSeasonsList()
            setSeasonsList(season.reverse())
            setLoading(false)
        })()
    }, [])

    const createDriverMappings = (results) => {
        const driverObject = {};
        results.Races[0].Results.forEach((result) => {
            const driverId = result.Driver.driverId;
            const fullName = result.Driver.givenName + ' ' + result.Driver.familyName;
            driverObject[driverId] = fullName;
        });
        setDriverMapping(driverObject)
    };

    const handleSeasonChange = async (event) => {
        setSelectedSeason(event.target.value);
        setRoundsList([])
        setSelectedRound(null)
        setRaceResult(null)
        setFastestLap(null)
        let roundsList = await getSeasonRounds(event.target.value)
        setRoundsList(roundsList)
    };

    const fastLap = (results) => {
        results.Races[0].Results.forEach((position, index) => {
            position?.FastestLap?.rank === '1' && setFastestLap(position?.FastestLap?.Time?.time)
        })
    }


    const podiumsFinishers = (results) => {
        let podiumObject = {}
        results.Races[0].Results.forEach((position, index) => {
            if (position?.position === '1') {
                podiumObject['first'] = `${position.Driver.givenName} ${position.Driver.familyName}`
            }
            if (position?.position === '2') {
                podiumObject['second'] = `${position.Driver.givenName} ${position.Driver.familyName}`
            }
            if (position?.position === '3') {
                podiumObject['third'] = `${position.Driver.givenName} ${position.Driver.familyName}`
            }
        })
        setPodium(podiumObject)
    }

    const getWeatherString = async (results) => {
        try {
            const {lat, long} = {...results.Races[0].Circuit.Location}
            const {date, time} = {...results.Races[0]}
            let weatherData = await getWeather(lat, long, date, time)
            let {conditions = null, temp = null} = weatherData?.currentConditions
            return conditions ? `Conditions : ${conditions} with ${temp}F` : null
        } catch (e) {
            console.log(e);
            return null
        }

    }


    const handleRoundChange = async (event) => {
        setLoading(true)
        setSelectedRound(event.target.value);
        setRaceResult(null)
        setFastestLap(null)
        let results = await getRaceResults(selectedSeason, event.target.value)
        let weather = getWeatherString(results)
        fastLap(results);
        createDriverMappings(results)
        podiumsFinishers(results)
        setWeather(weather)
        setRaceResult(results)
        setLoading(false)
    };

    return <div>
        {seasonsList.length > 0 && (
            <>
                <label hidden={true} htmlFor="season">Select a season</label>
                <select className={style.dropDown} name="season" id="" value={selectedSeason}
                        onChange={handleSeasonChange}>
                    <option disabled value="" selected>Select Season</option>
                    {seasonsList.map((season, index) => (
                        <option key={season.season} value={season.season}>
                            {season.season}
                        </option>
                    ))}
                </select>
            </>
        )}

        {roundsList.length > 0 && (
            <>
                <label hidden={true} htmlFor="round">Select a round</label>
                <select className={style.dropDown} name="round" id="" value={selectedRound}
                        onChange={handleRoundChange}>
                    <option disabled value="" selected>Select Round</option>
                    {roundsList.map((round, index) =>
                        <option key={round.round} value={round.round}>
                            {round.raceName}
                        </option>
                    )}
                </select>
            </>
        )}

        {loading && <p>Loading...</p>}

        {/*GP info*/}
        {raceResult &&
            <div className={style.gpInfo}>
                <div>
                    <p>{formatDate(raceResult.Races[0].date)}</p>
                    <h2> {raceResult.Races[0].raceName}</h2>
                    <p className={style.circuitName}>{raceResult.Races[0].Circuit.circuitName}, {raceResult.Races[0].Circuit.Location.locality}, {raceResult.Races[0].Circuit.Location.country}.</p>
                    <p className={style.weather}>{weather}</p>
                </div>
            </div>
        }

        {/*podium chart*/}
        {raceResult && <Podium data={podium}/>}

        {/*table*/}
        {raceResult && (
            <div className={style.raceResult}>
                <h3 className={style.headings}>Race Result</h3>
                <div className={style.tableContainer}>
                    <table rules={"none"} className={style.table}>
                        <thead>

                        <tr className={style.tableHeader}>
                            <th>Position</th>
                            <th>Driver Number</th>
                            <th>Driver</th>
                            <th>Constructor</th>
                            <th>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {raceResult.Races[0].Results.map((position, index) => <tr className={style.tableRow}
                                                                                  key={index}>

                            <td>{position.position}</td>
                            <td>{position.number}</td>
                            <td>{`${position.Driver.givenName} ${position.Driver.familyName}`}</td>
                            <td>{position.Constructor.name}</td>
                            <td>{position.points}{position?.FastestLap?.rank === '1' && '*'}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {selectedSeason > 1996 ? raceResult &&
            <PositionChart
                round={selectedRound}
                season={selectedSeason}
                fastestLap={fastestLap}
                driverMapping={driverMapping}
            /> : ''
        }

    </div>;
};

export default Races;
