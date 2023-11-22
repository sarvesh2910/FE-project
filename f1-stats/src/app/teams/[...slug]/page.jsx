'use client'
import { React, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './styles.module.css'

const Team = () => {

  // Get the constructor/team ID from slug
  const teamId = useParams()['slug'];

  // Get season
  const season = 2021;

  // Set states for team & drivers for team
  const [team, setTeam] = useState({ constructorId: '', name: '', url: '', nationality: ''});
  const [teamDrivers, setTeamDrivers] = useState([]);
  const [teamRaces, setTeamRaces] = useState([]);
  const [teamResults, setTeamResults] = useState([]);
  const [total, setTotal] = useState();
  const [topScoringRace, setTopScoringRace] = useState({raceName: '', driver: '', score: '', position: '', status: ''});
  const [bottomScoringRace, setBottomScoringRace] = useState({raceName: '', driver: '', score: '', position: '', status: ''});

  // Initialize URLs for API requests
  const teamUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}.json`;
  const teamDriversUrl = `https://ergast.com/api/f1/${season}/constructors/${teamId}/drivers.json`
  const teamResultsUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}/results.json`

  // Fetch team data from API asyncronously
  useEffect(() => {
    const getTeamData = async function fetchTeamDataFromURL() {
      try {
        const response = await fetch(teamUrl);

        // Now turn data into a json readable format
        const data = await response.json();
        const constructor = data['MRData']['ConstructorTable']['Constructors'][0];

        if (constructor) {
          setTeam(
            prevState => ({
              ...prevState,
              constructorId: constructor.constructorId,
              name: constructor.name,
              url: constructor.url,
              nationality: constructor.nationality
          }));
          console.log(team);
        } else {
          console.log('No constructors/teams found');
        }
        

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    // Fetch team driver data from API asyncronously
    const getTeamDriversData = async function fetchDriversDataFromURL() {
      try {
        const response = await fetch(teamDriversUrl);

        // Now turn data into a json readable format
        const data = await response.json();
        console.log(data);
        setTeamDrivers(data['MRData']['DriverTable']['Drivers']);
        console.log(data['MRData']['DriverTable']['Drivers']);
        console.log(teamDrivers);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    // Fetch team results from API asyncronously
    const getTeamResultsData = async function fetchResultsDataFromURL() {
      try {
        const response = await fetch(teamResultsUrl);

        // Now turn data into a json readable format
        const data = await response.json();


        const races = data['MRData']['RaceTable']['Races'];
        setTeamRaces(races);

        // Get total points for constructor 
        let totalPoints = 0;

        // Now get highest & lowerst scoring races
        let highestScore = 0;
        let highestScoreRace = '';
        let highestScoreDriver = '';
        let highestScorePosition = '';
        let highestScoreStatus = '';

        let lowestScore = 100;
        let lowestScoreRace = '';
        let lowestScoreDriver = '';
        let lowestScorePosition = '';
        let lowestScoreStatus = '';

        console.log(races[0]['Results']);

        for (let i = 0; i < races.length; i++) {
            console.log(` i = ${i}`);
            console.log(races[i]['Results'][0]);
            const highestResult = races[i]['Results'].reduce(function(prev, current) {
              totalPoints += parseInt(current.points);
              console.log(`totalpoints = ${totalPoints}`);

              if (+current.points > +prev.points) {
                  return current;
              } else {
                  return prev;
              }
              
            });
            console.log(`highestResult = ${highestResult.points}`);

            if (highestResult.points > highestScore) {
                console.log(`New highest score = ${highestScore.points}`);
                highestScore = highestResult.points;
                highestScoreRace = races[i].raceName;
                highestScoreDriver = highestResult.Driver.familyName;
                highestScorePosition = highestResult.position;
                highestScoreStatus = highestResult.status;
            }
            

            const lowestResult = races[i]['Results'].reduce(function(prev, current) {
              console.log(`current points = ${current.points}`);
              if (+current.points < +prev.points) {
                  return current;
              } else {
                  return prev;
              }
            });

            console.log(`lowestResult = ${lowestResult.points}`);

            if (lowestResult.points < lowestScore) {
                console.log(`New lowest score = ${lowestScore.points}`);
                lowestScore = lowestResult.points;
                lowestScoreRace = races[i].raceName;
                lowestScoreDriver = lowestResult.Driver.familyName;
                lowestScorePosition = lowestResult.position;
                lowestScoreStatus = lowestResult.status;
            }

        }

        setTotal(totalPoints);

        setTopScoringRace(
          prevState => ({
            ...prevState,
            raceName: highestScoreRace, 
            driver: highestScoreDriver, 
            score: highestScore, 
            position: highestScorePosition,
            status: highestScoreStatus
        }));

        setBottomScoringRace(
            prevState => ({
              ...prevState,
              raceName: lowestScoreRace, 
              driver: lowestScoreDriver, 
              score: lowestScore, 
              position: lowestScorePosition,
              status: lowestScoreStatus
        }));

        const results = data['MRData']['RaceTable']['Races'][0]['Results'];


        console.log(races);
        console.log(results);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    getTeamData();
    getTeamDriversData();
    getTeamResultsData();
  }, []);

  return (
    <div className={`${styles.team} container`}>
      <h1>{team.name}, <span className={styles.nationality}>{team.nationality}</span></h1>
      <a href={team.url} target='_blank'>View on Wikipedia</a>
      <div className={styles.seasonTitle}>
        <h2>{season} Season</h2>
      </div>
      <div className={styles.drivers}>
        <h2>Drivers</h2>
        <ul>
        {teamDrivers.map((teamDriver) => (
          <li key={teamDriver.driverId}>
            <a href={teamDriver.url} target='_blank'>{teamDriver.givenName} {teamDriver.familyName}</a>
          </li>
        ))}
        </ul>
      </div>
      <div className='row'>
        <h2>Stats</h2>
      </div>
      <div className={styles.stats}>
        <div className='row'>
          <div className='col-md-3 col-sm-6'>
            <div className={styles.stat}>
              <h3>Total Points</h3>
              <p>{total}</p>
            </div>
          </div>
          <div className='col-md-3 col-sm-6'>
            <div className={styles.stat}>
              <h3>Races:</h3>
              <ul className='races'>
                {teamRaces.map((race) => (
                  <li key={race.raceName}>
                    {race.raceName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='col-md-3 col-sm-6'>
            <div className={styles.stat}>
              <h3>Top Scoring Race</h3>
              <p>Race: {topScoringRace.raceName}</p>
              <p>Driver: {topScoringRace.driver}</p>
              <p>Score: {topScoringRace.score}</p>
              <p>Position: {topScoringRace.position}</p>
              <p>Status: {topScoringRace.status}</p>
            </div>
          </div>
          <div className='col-md-3 col-sm-6'>
            <div className={styles.stat}>
              <h3>Lowest Scoring Race</h3>
              <p>Race: {bottomScoringRace.raceName}</p>
              <p>Driver: {bottomScoringRace.driver}</p>
              <p>Score: {bottomScoringRace.score}</p>
              <p>Position: {bottomScoringRace.position}</p>
              <p>Status: {bottomScoringRace.status}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.previousData}>
        <div className='row'>
          <div className='col-sm-6'>
            <div className={styles.previousYearsChampionship}>
              <p>Previous Year Championship Points</p>
            </div>
          </div>
          <div className='col-sm-6'>
            <div className={styles.previousMatchBestFinishPosition}>
              <p>Previous Match Best Finish Position</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
