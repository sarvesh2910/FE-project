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
    <div class='container'>
      <h1>{team.name}, <span className='nationality'>{team.nationality}</span></h1>
      <a href={team.url} target='_blank'>View on Wikipedia</a>
      <div className='row stats'>
        <div className='col-3 stat'>
          <p>Stat #1</p>
        </div>
        <div className='col-3 stat'>
          <p>Stat #2</p>
        </div>
        <div className='col-3 stat'>
          <p>Stat #3</p>
        </div>
        <div className='col-3 stat'>
          <p>Stat #4</p>
        </div>
      </div>
      <div className='row previous-data'>
        <div className='col-6'>
          <div class='previous-years-championship'>
            <p>Previous Year's Championship Points</p>
          </div>
        </div>
        <div className='col-6'>
        <div class='previous-match-best-finish-position'>
          <p>Previous Match Best Finish Position</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
