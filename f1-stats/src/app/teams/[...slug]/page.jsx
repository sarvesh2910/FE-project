'use client'
import { React, useState, useEffect } from "react";
import { useParams } from 'next/navigation';

const Team = () => {

  const [team, setTeam] = useState([]);
  const teamName = useParams()['slug'];
  const url = `http://ergast.com/api/f1/constructors/${teamName}.json`;

  // Fetch data from API asyncronously
  useEffect(() => {
    const getData = async function fetchDataFromURL() {
      try {
        const response = await fetch(url);

        // Now turn data into a json readable format
        const data = await response.json();
        setTeam(data["MRData"]["ConstructorTable"]["Constructors"][0]);
        console.log(team);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <h1>{teamName}</h1>
      <p>{team.id}</p>
    </div>
  );
};

export default Team;
