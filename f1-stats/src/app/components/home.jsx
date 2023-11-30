'use client'
import {React, useState, useEffect} from 'react';
import {getCurrentDriverStandings, getCurrentTeamsStandings, getSeasonsList} from "@/app/api/api";
import Podium from "@/app/races/podium";
import style from './home.module.css'
import tableStyle from '../races/races.module.css'
const HomeDash = () => {
    let [loading, setLoading] = useState(true)
    const [driverStanding, setDriverStanding] = useState([])
    const [teamStanding, setTeamStanding] = useState([])
    useEffect(() => {
        (async () => {
            let dStandings = await getCurrentDriverStandings()
            console.log(dStandings);
            let tStandings = await getCurrentTeamsStandings()
            console.log(tStandings);
            setDriverStanding(dStandings)
            setTeamStanding(tStandings)
            setLoading(false)
        })()
    }, []);

    const getDriverPodium = () => {
        const first = driverStanding?.filter(position => position.position === '1')[0]
        const second = driverStanding?.filter(position => position.position === '2')[0]
        const third = driverStanding?.filter(position => position.position === '3')[0]
        return {
            first: `${first.Driver.givenName} ${first.Driver.familyName}`,
            second: `${second.Driver.givenName} ${second.Driver.familyName}`,
            third: `${third.Driver.givenName} ${third.Driver.familyName}`
        }
    }

    const getTeamPodium = () => {
        const first = teamStanding?.filter(position => position.position === '1')[0]
        console.log(first);
        const second = teamStanding?.filter(position => position.position === '2')[0]
        const third = teamStanding?.filter(position => position.position === '3')[0]
        return {
            first: `${first.Constructor.name}`,
            second: `${second.Constructor.name}`,
            third: `${third.Constructor.name}`
        }
    }

    return (
        <div>
            {loading && <p>Loading...</p>}
            {!loading &&
                <div className={style.container}>
                    <div className={style.seasonInfo}>
                        <h2>Formula 1</h2>
                        <p>Season 2023 </p>
                    </div>
                    <div className={style.standings}>
                        <div className={`${style.driver} ${style.partition}`}>
                            <h2>Drivers Championship</h2>
                            <Podium data={getDriverPodium()}/>
                            <div className={tableStyle.raceResult}>
                                <h4 className={tableStyle.headings}>Standings Table</h4>
                                <div className={tableStyle.tableContainer}>
                                    <table rules={"none"} className={tableStyle.table}>
                                        <thead>
                                        <tr className={tableStyle.tableHeader}>
                                            <th>Position</th>
                                            <th>Driver</th>
                                            <th>Constructor</th>
                                            <th>Points</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {driverStanding.map((position, index) => <tr
                                            className={tableStyle.tableRow}
                                            key={index}>
                                            <td>{position.position}</td>
                                            <td>{`${position.Driver.givenName} ${position.Driver.familyName}`}</td>
                                            <td>{position.Constructors[0].name}</td>
                                            <td>{position.points}</td>
                                        </tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.team} ${style.partition}`}>
                            <h2>Constructors  Championship</h2>
                            <Podium data={getTeamPodium()}/>
                            <div className={tableStyle.raceResult}>
                                <h4 className={tableStyle.headings}>Standings Table</h4>
                                <div className={tableStyle.tableContainer}>
                                    <table rules={"none"} className={tableStyle.table}>
                                        <thead>
                                        <tr className={tableStyle.tableHeader}>
                                            <th>Position</th>
                                            <th>Driver</th>
                                            <th>Nationality</th>
                                            <th>Points</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {teamStanding.map((position, index) => <tr
                                            className={tableStyle.tableRow}
                                            key={index}>
                                            <td>{position.position}</td>
                                            <td>{`${position.Constructor.name}`}</td>
                                            <td>{position.Constructor.nationality}</td>
                                            <td>{position.points}</td>
                                        </tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default HomeDash;

