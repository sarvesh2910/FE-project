'use client'
import { React, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const Team = () => {

  const [team, setTeam] = useState({ constructorId: '', name: '', url: '', nationality: ''});
  const teamId = useParams()['slug'];
  const url = `http://ergast.com/api/f1/constructors/${teamId}.json`;
  console.log(`url = ${url}`);

  // Fetch data from API asyncronously
  useEffect(() => {
    const getData = async function fetchDataFromURL() {
      try {
        const response = await fetch(url);

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

    getData();
  }, []);

  return (
    <div>
      <h1>{team.name}</h1>
      <a href={team.url} target='_blank'>View on Wikipedia</a>
      <p>Nationality: {team.nationality}</p>
    </div>
  );
};

export default Team;
