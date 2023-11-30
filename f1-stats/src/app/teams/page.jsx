"use client"; // This is a client component
import { React, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";

const Teams = () => {
  let [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [season, setSeason] = useState("2023");
  const url = `http://ergast.com/api/f1/${season}/constructors.json`;

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
    getData(url).then(setLoading(false));
  }, []);

  const handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    var formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    //Set season and re-collect data
    setSeason(formValues["season"]);
    getData(
      `http://ergast.com/api/f1/${formValues["season"]}/constructors.json`
    ).then(setTimeout(() => {
      setLoading(false);
    }, "1500"));
  };

  return (
    <div className="container">
      <div className={styles.row}>
        <div className={styles.teamsTitle}>
          <h1>Teams</h1>
          <form onSubmit={handleSubmit} className={styles.seasonSelection}>
            <div className="form-group">
              <input
                name="season"
                className={`${styles.dropDown} form-control rounded-0`}
                id="season"
                type="number"
                min="1950"
                max="2023"
                defaultValue="2023"
              />
              <input
                className={`${styles.submitButton} btn btn-primary rounded-0`}
                type="submit"
                value="Select"
              />
            </div>
          </form>
        </div>
      </div>
      <div className={`${styles.row} ${styles.seasonResults}`}>
        {loading && <p>Loading...</p>}

        <div>
          {!loading && (
            <>
              <h2>{season} Season</h2>
              <ul className={styles.teams}>
                {teams.map((team) => (
                  <li key={team.constructorId}>
                    <Link href={`/teams/${team.constructorId}/${season}`}>
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
