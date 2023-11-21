"use client"; // This is a client component
import { React, useState, useEffect } from 'react';
import Link from 'next/link'

const Teams = () => {

  const season = 2021;
  const url = `http://ergast.com/api/f1/${season}/constructors.json`;
  const [teams, setTeams] = useState([]);

  // Fetch data from API asyncronously
  useEffect(() => {
    const getData = async function fetchDataFromURL() {
      try {
        const response = await fetch(url);

        // Now turn data into a json readable format
        const data = await response.json();
        setTeams(data['MRData']['ConstructorTable']['Constructors']);
        console.log(data['MRData']['ConstructorTable']['Constructors']);
        console.log(teams);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    getData();
  }, []);

  return (
    <div className='container'>
      <h1>Teams</h1>
      <h2>{season} Season</h2>
      <ul className='teams'>
        {teams.map((team) => (
          <li key={team.constructorId}>
            <Link href={`/teams/${team.constructorId}`}>{team.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
