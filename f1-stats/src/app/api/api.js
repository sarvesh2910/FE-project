export async function getSeasonsList() {
    return await fetch('https://ergast.com/api/f1/seasons.json?limit=100')
        .then(data => data.json())
        .then(data => data.MRData.SeasonTable.Seasons)
        .catch(error => {
            console.error(error)
            return error
        })
}

export async function getSeasonRounds(season) {
    console.log(season);
    return await fetch(`https://ergast.com/api/f1/${season}.json?limit=100`)
        .then(data => data.json())
        .then(data => data.MRData.RaceTable.Races)
        .catch(error => {
            console.error(error)
            return error
        })
}

export async function getRaceResults(season,round) {
    console.log(season);
    return await fetch(`https://ergast.com/api/f1/${season}/${round}/results.json?`)
        .then(data => data.json())
        .then(data => data.MRData.RaceTable)
        .catch(error => {
            console.error(error)
            return error
        })
}


export async function getLapByLaps(season,round) {
    console.log(season);
    return await fetch(`https://ergast.com/api/f1/${season}/${round}/laps.json?limit=1000`)
        .then(data => data.json())
        .then(data => data.MRData.RaceTable)
        .catch(error => {
            console.error(error)
            return error
        })
}

export async function getCurrentDriverStandings() {
    return await fetch(`https://ergast.com/api/f1/current/driverStandings.json`)
        .then(data => data.json())
        .then(data => data.MRData.StandingsTable.StandingsLists[0].DriverStandings)
        .catch(error => {
            console.error(error)
            return error
        })
}

export async function getCurrentTeamsStandings() {
    return await fetch(`https://ergast.com/api/f1/current/constructorStandings.json`)
        .then(data => data.json())
        .then(data => data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings)
        .catch(error => {
            console.error(error)
            return error
        })
}
