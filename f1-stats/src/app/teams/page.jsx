"use client"; // This is a client component
import { React, useState, useEffect } from 'react';
import Link from 'next/link'

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState('2021');
  const url = `http://ergast.com/api/f1/${season}/constructors.json`;

  // Fetch data from API asyncronously
  const getData = async function fetchDataFromURL(endpoint) {
    console.log(endpoint);
    try {
      const response = await fetch(endpoint);

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

  useEffect(() => {
    getData(url);
  }, []);

  const handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);
    console.log('form values', formValues)

    //Set season and re-collect data
    setSeason(formValues['season']);
    getData(`http://ergast.com/api/f1/${formValues['season']}/constructors.json`);
  }

  return (
    <div className='container'>
      <h1>Teams</h1>
      <h2>{season} Season</h2>
      <form onSubmit={handleSubmit}>
        <input name='season' type='number' min='1950' max='2023' defaultValue='2021' />
        <input type='submit'/>
      </form>
      <ul className='teams'>
        {teams.map((team) => (
          <li key={team.constructorId}>
            <Link href={`/teams/${team.constructorId}/${season}`}>{team.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
