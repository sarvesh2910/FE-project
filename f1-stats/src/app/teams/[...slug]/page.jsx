'use client'
import { React, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './styles.module.css'

const Team = () => {

  // Get the constructor/team ID from slug
  const teamId = useParams()['slug'];

  // Get season
  const season = 2022;

  // Set states for team & drivers for team
  const [team, setTeam] = useState({ constructorId: '', name: '', url: '', nationality: ''});
  const [teamDrivers, setTeamDrivers] = useState([]);

  // Initialize URLs for API requests
  const teamUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}.json`;
  const teamDriversUrl = `https://ergast.com/api/f1/${season}/constructors/${teamId}/drivers.json`

  // Fetch team data from API asyncronously
  useEffect(() => {
    const getTeamData = async function fetchDataFromURL() {
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
    const getTeamDriversData = async function fetchDataFromURL() {
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

    getTeamData();
    getTeamDriversData();
  }, []);

  return (
    <div class='container team'>
      <h1>{team.name}, <span className={styles.nationality}>{team.nationality}</span></h1>
      <a href={team.url} target='_blank'>View on Wikipedia</a>
      <div className={styles.seasonTitle}>
        <h2>Season {season}</h2>
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
      <div class='row'>
        <h2>Stats</h2>
      </div>
      <div className={styles.stats}>
        <div className='row'>
          <div className={`${styles.stat} col-3`}>
            <p>Stat #1</p>
          </div>
          <div className={`${styles.stat} col-3`}>
            <p>Stat #2</p>
          </div>
          <div className={`${styles.stat} col-3`}>
            <p>Stat #3</p>
          </div>
          <div className={`${styles.stat} col-3`}>
            <p>Stat #4</p>
          </div>
        </div>
      </div>
      <div class={styles.previousData}>
        <div className='row'>
          <div className='col-6'>
            <div className={styles.previousYearsChampionship}>
              <p>Previous Year Championship Points</p>
            </div>
          </div>
          <div className='col-6'>
            <div class={styles.previousMatchBestFinishPosition}>
              <p>Previous Match Best Finish Position</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
