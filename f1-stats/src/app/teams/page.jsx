"use client"; // This is a client component
import { React, useState, useEffect } from "react";


const Teams = () => {

  const url = 'http://ergast.com/api/f1/constructors.json';
  const [teams, setTeams] = useState([]);

  // Fetch data from API asyncronously
  useEffect(() => {
    const getData = async function fetchDataFromURL() {
      try {
        const response = await fetch(url);

        // Now turn data into a json readable format
        const data = await response.json();
        setTeams(data["MRData"]["ConstructorTable"]["Constructors"]);

      } catch (error) {
        // Error from API fetch
        console.error('Request failed', error);
      }
    };

    getData();
  }, []);

  return (
    <div>
      <h1>Teams</h1>
      <ul class="teams">
        {teams.map((team) => (
          <li key={team.constructorId}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Teams;
