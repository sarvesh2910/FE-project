'use client'
import { React, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './styles.module.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Team = () => {

  // Get the constructor/team ID from slug
  const teamId = useParams()['slug'][0];

  // Get season
  const season = useParams()['slug'][1];
  // Need to handle when season is not in range/no info for season

  // Set states for team & drivers for team
  const [team, setTeam] = useState({ constructorId: '', name: '', url: '', nationality: ''});
  const [teamDrivers, setTeamDrivers] = useState([]);
  const [teamRaces, setTeamRaces] = useState([]);
  const [teamResults, setTeamResults] = useState([]);
  const [lastYearTeamResults, setLastYearTeamResults] = useState([]);
  const [total, setTotal] = useState();
  const [topScoringRace, setTopScoringRace] = useState({raceName: '', driver: '', score: '', position: '', status: ''});
  const [bottomScoringRace, setBottomScoringRace] = useState({raceName: '', driver: '', score: '', position: '', status: ''});
  const [firstDriver, setFirstDriver] = useState();
  const [secondDriver, setSecondDriver] = useState();

  // Initialize URLs for API requests
  const teamUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}.json`;
  const teamDriversUrl = `https://ergast.com/api/f1/${season}/constructors/${teamId}/drivers.json`
  const teamResultsUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}/results.json`
  const racesUrl = `http://ergast.com/api/f1/${season}.json`;

  // Get last season year // need to handle when last year doesn't have data
  const lastSeason = season-1;
  const teamResultsLastYearUrl = `http://ergast.com/api/f1/${lastSeason}/constructors/${teamId}/results.json`

  // Fetch team data from API asyncronously
  useEffect(() => {
    const getTeam = async function fetchTeamDataFromURL() {
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
        } else {
          console.log('No constructors/teams found');
        }
        

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    // Fetch team driver data from API asyncronously
    const getTeamDrivers = async function fetchDriversDataFromURL() {
      try {
        const response = await fetch(teamDriversUrl);

        // Now turn data into a json readable format
        const data = await response.json();

        setTeamDrivers(data['MRData']['DriverTable']['Drivers']);
        console.log(data['MRData']['DriverTable']['Drivers']);
        console.log(teamDrivers);

        
        setFirstDriver(data['MRData']['DriverTable']['Drivers'][0].familyName);
        setSecondDriver(data['MRData']['DriverTable']['Drivers'][1].familyName);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    // Fetch team results from API asyncronously
    const getResults = async function fetchResultsDataFromURL() {
      try {
        const response = await fetch(teamResultsUrl);

        // Now turn data into a json readable format
        const data = await response.json();
        console.log(data);

        // Get races from data
        const races = data['MRData']['RaceTable']['Races'];
        console.log(races);
        setTeamRaces(races);

        // Declare total points for constructor 
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

        //Results
        let resultArray = [];

        for (let i = 0; i < races.length; i++) {

            let j = 0;
            if (resultArray.length > 0) {
              j = parseInt(resultArray[resultArray.length-1]);
            }

            const firstResult = parseInt(races[i]['Results'][0]['points']);
            const secondResult = parseInt(races[i]['Results'][1]['points']);
            const thisRacePoints = firstResult + secondResult;

            resultArray.push(j + thisRacePoints);
            totalPoints += thisRacePoints;

            const highestResult = races[i]['Results'].reduce(function(prev, current) {
              if (+current.points > +prev.points) {
                  console.log(`current = ${current.points}`);
                  return current;
              } else {
                console.log(`prev = ${prev.points}`);
                  return prev;
              }
            });

            if (parseInt(highestResult.points) > parseInt(highestScore)) {
                console.log(races[i]);
                console.log(`${races[i].raceName} is highest scoring at ${highestResult.points}`);
                highestScore = highestResult.points;
                highestScoreRace = races[i].raceName;
                highestScoreDriver = highestResult.Driver.familyName;
                highestScorePosition = highestResult.position;
                highestScoreStatus = highestResult.status;
            }
            

            const lowestResult = races[i]['Results'].reduce(function(prev, current) {
              if (+current.points < +prev.points) {
                  return current;
              } else {
                  return prev;
              }
            });

            if (parseInt(lowestResult.points) < parseInt(lowestScore)) {
                lowestScore = lowestResult.points;
                lowestScoreRace = races[i].raceName;
                lowestScoreDriver = lowestResult.Driver.familyName;
                lowestScorePosition = lowestResult.position;
                lowestScoreStatus = lowestResult.status;
            }

        }

        // Set total using accumulated points
        setTotal(totalPoints);

        // Set top scoring race stat
        setTopScoringRace(
          prevState => ({
            ...prevState,
            raceName: highestScoreRace, 
            driver: highestScoreDriver, 
            score: highestScore, 
            position: highestScorePosition,
            status: highestScoreStatus
        }));

        // Set bottom scoring race stat
        setBottomScoringRace(
            prevState => ({
              ...prevState,
              raceName: lowestScoreRace, 
              driver: lowestScoreDriver, 
              score: lowestScore, 
              position: lowestScorePosition,
              status: lowestScoreStatus
        }));

        // Now get individual results for races
        //console.log(races);
        //console.log(results);
        console.log(resultArray);
        setTeamResults(resultArray);
        console.log(teamResults);
        

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    const getLastYearResults = async function fetchLastYearResultsDataFromURL() {
      try {
        const response = await fetch(teamResultsLastYearUrl);

        // Now turn data into a json readable format
        const data = await response.json();
        const lastYearRaces = data['MRData']['RaceTable']['Races'];

        let resultArray = [];
        let highestPosition = 0;

        for (let i = 0; i < lastYearRaces.length; i++) {
          let j = 0;
          if (resultArray.length > 0) {
            j = parseInt(resultArray[resultArray.length-1]);
          }

          const firstResult = parseInt(lastYearRaces[i]['Results'][0]['points']);
          const secondResult = parseInt(lastYearRaces[i]['Results'][1]['points']);

          const thisRacePoints = firstResult + secondResult;

          console.log(`${j} + ${firstResult} + ${secondResult}`);
          resultArray.push(j + thisRacePoints);

          highestPosition = lastYearRaces[i]['Results'].reduce(function(prev, current) {
            if (+current.position > +prev.position) {
                return current.position;
            } else {
                return prev.position;
            }
          });
        };

        setLastYearTeamResults(resultArray);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };


    getTeam();
    getTeamDrivers();
    getResults();
    getLastYearResults();
  }, []);

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Points Earned Per Grand Prix',
      },
    },
  };

  const lineLabels = teamRaces.map(race => 'Round ' + race.round);

  //need to fix labels
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: lastSeason,
        data: lastYearTeamResults,
        borderColor: 'blue',
        backgroundColor: 'blue',
      },
      {
        label: season,
        data: teamResults,
        borderColor: 'red',
        backgroundColor: 'red',
      }
    ]
  };

  const lastLineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Position Per Grand Prix',
      },
    },
    scales: {
      y: {
        reverse: true
      }
    }
  };

  console.log(teamRaces);
  const lastLineLabels = teamRaces.map(race => 'Round ' + race.round);
  const lineResultsFirstDriver = teamRaces.map(race => race.Results[0].position);
  const lineResultsSecondDriver = teamRaces.map(race => race.Results[1].position);

  


  //need to fix labels
  const lastLineData = {
    labels: lastLineLabels,
    datasets: [
      {
        label: firstDriver,
        data: lineResultsFirstDriver,
        borderColor: 'green',
        backgroundColor: 'green',
      },
      {
        label: secondDriver,
        data: lineResultsSecondDriver,
        borderColor: 'orange',
        backgroundColor: 'orange',
      }
    ]
  };

  

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
            <div className={`${styles.stat} card`}>
              <h3>Total Points</h3>
              <p className={styles.totalPoints}>{total}</p>
            </div>
          </div>
          <div className='col-md-3 col-sm-6'>
            <div className={`${styles.stat} card`}>
              <h3>Races</h3>
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
            <div className={`${styles.stat} card`}>
              <h3>Top Race Score</h3>
              <p>Race: {topScoringRace.raceName}</p>
              <p>Driver: {topScoringRace.driver}</p>
              <p>Score: {topScoringRace.score}</p>
              <p>Position: {topScoringRace.position}</p>
              <p>Status: {topScoringRace.status}</p>
            </div>
          </div>
          <div className='col-md-3 col-sm-6'>
            <div className={`${styles.stat} card`}>
              <h3>Lowest Race Score</h3>
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
            <div className={`${styles.previousYearsChampionship} card`}>
              <p>Previous Year Championship Points</p>
              <Line options={lineOptions} data={lineData} />
            </div>
          </div>
          <div className='col-sm-6'>
            <div className={`${styles.previousMatchBestFinishPosition} card`}>
              <p>{season} Driver Positions</p>
              <Line options={lastLineOptions} data={lastLineData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
