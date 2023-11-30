"use client";
import { React, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./styles.module.css";
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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

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
  let [loading, setLoading] = useState(true);

  // Get the constructor/team ID from slug
  const teamId = useParams()["slug"][0];

  // Get season
  const season = useParams()["slug"][1];
  // Need to handle when season is not in range/no info for season

  // Set states for team & drivers for team
  const [team, setTeam] = useState({
    constructorId: "",
    name: "",
    url: "",
    nationality: "",
  });
  const [teamDrivers, setTeamDrivers] = useState([]);
  const [teamRaces, setTeamRaces] = useState([]);
  const [teamResults, setTeamResults] = useState([]);
  const [lastYearTeamResults, setLastYearTeamResults] = useState([]);
  const [topScoringRace, setTopScoringRace] = useState({
    raceName: "",
    driver: "",
    score: "",
    position: "",
    status: "",
  });
  const [bottomScoringRace, setBottomScoringRace] = useState({
    raceName: "",
    driver: "",
    score: "",
    position: "",
    status: "",
  });
  const [previousYearBestPosition, setPreviousYearBestPosition] = useState();

  // Initialize URLs for API requests
  const teamUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}.json`;
  const teamDriversUrl = `https://ergast.com/api/f1/${season}/constructors/${teamId}/drivers.json`;
  const teamResultsUrl = `http://ergast.com/api/f1/${season}/constructors/${teamId}/results.json`;

  // Get last season year // need to handle when last year doesn't have data
  const lastSeason = season - 1;
  const teamResultsLastYearUrl = `http://ergast.com/api/f1/${lastSeason}/constructors/${teamId}/results.json`;

  // Fetch team data from API asyncronously
  useEffect(() => {
    getAll().then(setLoading(false));
  }, []);

  const getAll = async function getAllData() {
    getTeam();
    getTeamDrivers();
    getLastYearResults();
    getResults();
  };

  const getTeam = async function fetchTeamDataFromURL() {
    try {
      const response = await fetch(teamUrl);

      // Now turn data into a json readable format
      const data = await response.json();
      const constructor = data["MRData"]["ConstructorTable"]["Constructors"][0];

      if (constructor) {
        setTeam((prevState) => ({
          ...prevState,
          constructorId: constructor.constructorId,
          name: constructor.name,
          url: constructor.url,
          nationality: constructor.nationality,
        }));
      } else {
        console.log("No constructors/teams found");
      }
    } catch (error) {
      // Error from API fetch
      console.error("Request failed", error);
    }
  };

  // Fetch team driver data from API asyncronously
  const getTeamDrivers = async function fetchDriversDataFromURL() {
    try {
      const response = await fetch(teamDriversUrl);

      // Now turn data into a json readable format
      const data = await response.json();

      setTeamDrivers(data["MRData"]["DriverTable"]["Drivers"]);
    } catch (error) {
      // Error from API fetch
      console.error("Request failed", error);
    }
  };

  // Fetch team results from API asyncronously
  const getResults = async function fetchResultsDataFromURL() {
    try {
      const response = await fetch(teamResultsUrl);

      // Now turn data into a json readable format
      const data = await response.json();

      // Get races from data
      const races = data["MRData"]["RaceTable"]["Races"];
      console.log(races);
      setTeamRaces(races);

      // Now get highest & lowerst scoring races
      let highestScore = 0;
      let highestScoreRace = "";
      let highestScoreDriver = "";
      let highestScorePosition = "";
      let highestScoreStatus = "";

      let lowestScore = 100;
      let lowestScoreRace = "";
      let lowestScoreDriver = "";
      let lowestScorePosition = "";
      let lowestScoreStatus = "";

      //Results
      let resultArray = [];

      for (let i = 0; i < races.length; i++) {
        let j = 0;
        if (resultArray.length > 0) {
          j = parseInt(resultArray[resultArray.length - 1]);
        }

        const thisRacePointsArray = races[i]["Results"].map(
          (result) => result["points"]
        );
        let thisRacePoints = thisRacePointsArray.reduce(
          (partialSum, a) => parseInt(partialSum) + parseInt(a),
          0
        );

        resultArray.push(j + thisRacePoints);

        const highestResult = races[i]["Results"].reduce(function (
          prev,
          current
        ) {
          if (+current.points > +prev.points) {
            return current;
          } else {
            return prev;
          }
        });

        if (parseInt(highestResult.points) > parseInt(highestScore)) {
          highestScore = highestResult.points;
          highestScoreRace = races[i].raceName;
          highestScoreDriver = highestResult.Driver.familyName;
          highestScorePosition = highestResult.position;
          highestScoreStatus = highestResult.status;
        }

        const lowestResult = races[i]["Results"].reduce(function (
          prev,
          current
        ) {
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

      // Set top scoring race stat
      setTopScoringRace((prevState) => ({
        ...prevState,
        raceName: highestScoreRace,
        driver: highestScoreDriver,
        score: highestScore,
        position: highestScorePosition,
        status: highestScoreStatus,
      }));

      // Set bottom scoring race stat
      setBottomScoringRace((prevState) => ({
        ...prevState,
        raceName: lowestScoreRace,
        driver: lowestScoreDriver,
        score: lowestScore,
        position: lowestScorePosition,
        status: lowestScoreStatus,
      }));

      // Now get individual results for races
      setTeamResults(resultArray);
    } catch (error) {
      // Error from API fetch
      console.error("Request failed", error);
    }
  };

  const getLastYearResults = async function fetchLastYearResultsDataFromURL() {
    try {
      const response = await fetch(teamResultsLastYearUrl);

      // Now turn data into a json readable format
      const data = await response.json();
      const lastYearRaces = data["MRData"]["RaceTable"]["Races"];

      let resultArray = [];
      let highestPositionPerRace = 100;
      let highestPositionTotal = 100;

      for (let i = 0; i < lastYearRaces.length; i++) {
        let j = 0;
        if (resultArray.length > 0) {
          j = parseInt(resultArray[resultArray.length - 1]);
        }

        const thisRacePointsArray = lastYearRaces[i]["Results"].map(
          (result) => result["points"]
        );
        let thisRacePoints = thisRacePointsArray.reduce(
          (partialSum, a) => parseInt(partialSum) + parseInt(a),
          0
        );

        resultArray.push(j + thisRacePoints);

        const lastYearResults = lastYearRaces[i]["Results"].map(
          (result) => result.position
        );
        console.log(lastYearResults);

        highestPositionPerRace = Math.min(parseInt(lastYearResults));

        console.log(
          `is ${highestPositionPerRace} smaller or equal to ${highestPositionTotal}?`
        );
        if (
          parseInt(highestPositionPerRace) <= parseInt(highestPositionTotal)
        ) {
          console.log("The value is smaller this time");
          highestPositionTotal = parseInt(highestPositionPerRace);
          console.log(`highestPositionTotal = ${highestPositionTotal}`);
        }
      }

      setPreviousYearBestPosition(highestPositionTotal);

      setLastYearTeamResults(resultArray);
    } catch (error) {
      // Error from API fetch
      console.error("Request failed", error);
    }
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Points Earned Per Round",
        position: "top",
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Rounds'
        },
      },
      y: {
        title: {
          display: true,
          text: 'Points'
        }
      }
    },
  };

  const lineLabels = teamRaces.map((race) => race.round);

  //need to fix labels
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: lastSeason,
        data: lastYearTeamResults,
        borderColor: "#8A3FFC",
        backgroundColor: "grey",
      },
      {
        label: season,
        data: teamResults,
        borderColor: "#BA4E00",
        backgroundColor: "grey",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Best Position Per Season",
        position: "top",
      },
    },
    scales: {
      x: {
        reverse: true,
      },
    },
  };

  const barLabels = [lastSeason, season];

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Best Position",
        data: [previousYearBestPosition, topScoringRace.position],
        borderColor:
          "black",
        backgroundColor:
          "black",
      },
    ],
  };

  return (
    <div className={`container`}>
      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          <h1 className={styles.teamTitle}>
            {team.name},{" "}
            <span className={styles.nationality}>{team.nationality}</span>
          </h1>
          <a href={team.url} target="_blank">
            View on Wikipedia
          </a>
          <hr></hr>

          <div className={styles.seasonTitle}>
            <em>{season} Season</em>
          </div>
          <div className={styles.drivers}>
            <h2 className={styles.sectionTitle}>Drivers</h2>
            <ul>
              {teamDrivers.map((teamDriver) => (
                <li key={teamDriver.driverId}>
                  <a href={teamDriver.url} target="_blank">
                    {teamDriver.givenName} {teamDriver.familyName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="row">
            <h2 className={styles.sectionTitle}>Stats</h2>
          </div>
          <div className={styles.stats}>
            <div className="row">
              <div className="col-lg-4">
                <div className={`${styles.stat} card rounded-0`}>
                  <div class={`${styles.statHeader} card-header rounded-0`}>
                    <h3 className={styles.sectionTitleH3}>Total Points</h3>
                  </div>
                  <div class="card-body">
                    <p className={styles.totalPoints}>{teamResults[teamResults.length-1]}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className={`${styles.stat} card rounded-0`}>
                  <div class={`${styles.statHeader} card-header rounded-0`}>
                    <h3 className={styles.sectionTitleH3}>Top Race Score</h3>
                  </div>
                  <div class="card-body">
                    <p>Race: {topScoringRace.raceName}</p>
                    <p>Driver: {topScoringRace.driver}</p>
                    <p>Score: {topScoringRace.score}</p>
                    <p>Position: {topScoringRace.position}</p>
                    <p>Status: {topScoringRace.status}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className={`${styles.stat} card rounded-0`}>
                  <div class={`${styles.statHeader} card-header rounded-0`}>
                    <h3 className={styles.sectionTitleH3}>Lowest Race Score</h3>
                  </div>
                  <div class="card-body">
                    <p>Race: {bottomScoringRace.raceName}</p>
                    <p>Driver: {bottomScoringRace.driver}</p>
                    <p>Score: {bottomScoringRace.score}</p>
                    <p>Position: {bottomScoringRace.position}</p>
                    <p>Status: {bottomScoringRace.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.previousData}>
            <div className="row">
              <div className="col-lg-6">
                <div className={`card rounded-0`}>
                  <div class={`${styles.statHeader} card-header rounded-0`}>
                    <h2 className={styles.sectionTitle}>Previous Total Points</h2>
                  </div>
                  <div className='card-body'>
                    <Line options={lineOptions} data={lineData} />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div
                  className={` card rounded-0`}
                >
                  <div class={`${styles.statHeader} card-header rounded-0`}>
                    <h2 className={styles.sectionTitle}>
                      Previous Best Finish Position
                    </h2>
                  </div>
                  <div className='card-body'>
                    <Bar
                      options={barOptions}
                      data={barData}
                      className="positionBar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Team;
