"use client"; // This is a client component
import { React, useState, useEffect } from "react";
import {getSeasonsList} from '../api/api'
import Link from "next/link";
import styles from "./styles.module.css";

const Teams = () => {
  let [loading, setLoading] = useState(true);
  let [seasonsList, setSeasonsList] = useState([])
  const [teams, setTeams] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const url = `http://ergast.com/api/f1/${selectedSeason}/constructors.json`;

  // Fetch data from API asyncronously
  const getData = async function fetchDataFromURL(endpoint) {
    try {
      const response = await fetch(endpoint);

      // Now turn data into a json readable format
      const data = await response.json();
      setTeams(data["MRData"]["ConstructorTable"]["Constructors"]);
    } catch (error) {
      // Error from API fetch
      console.error("Request failed", error);
    }
  };

  useEffect(() => {
    (async () => {
      let season = await getSeasonsList()
      setSeasonsList(season.reverse())
      setLoading(false)
    })()
  }, []);

  /*const handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    var formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    //Set season and re-collect data
    setSeason(formValues["season"]);
    getData(
      `http://ergast.com/api/f1/${formValues["season"]}/constructors.json`
    ).then(
      setTimeout(() => {
        setLoading(false);
      }, "1500")
    );
  };*/

  const handleSeasonChange = async (event) => {
    setLoading(true);
    setSelectedSeason(event.target.value);

    //Set season and re-collect data
    getData(
      `http://ergast.com/api/f1/${event.target.value}/constructors.json`
    ).then(
      setTimeout(() => {
        setLoading(false);
      }, "1500")
    );
  };

  return (
    <div className="container">
      <div className={styles.row}>
        <div className={styles.teamsTitle}>
          <h1>Teams</h1>
          <label hidden={true} htmlFor="season">Select a season</label>
                <select className={styles.dropDown} name="season" id="" value={selectedSeason}
                        onChange={handleSeasonChange}>
                    <option disabled value="" selected>Select Season</option>
                    {seasonsList.map((season, index) => (
                        <option key={season.season} value={season.season}>
                            {season.season}
                        </option>
                    ))}
                </select>
        </div>
      </div>
      <div className={`${styles.row} ${styles.seasonResults}`}>
        {loading && <p>Loading...</p>}

        <div>
          {!loading && (
            <>
              <ul className={styles.teams}>
                {teams.map((team) => (
                  <li key={team.constructorId}>
                    <Link href={`/teams/${team.constructorId}/${selectedSeason}`}>
                      {team.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
