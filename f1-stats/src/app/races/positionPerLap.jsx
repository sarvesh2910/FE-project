'use client'
import React, {useEffect, useState} from "react";
import {getLapByLaps} from "@/app/api/api";
import {BoxplotChart, LineChart} from '@carbon/charts-react'
import '@carbon/charts-react/styles.css'
import style from './races.module.css';

export const convertTimeToSeconds = (timeString) => {
    timeString = timeString.replace(/([.])+/g, ':')
    const timeComponents = timeString.split(':');
    const minutes = parseInt(timeComponents[0], 10);
    const seconds = parseInt(timeComponents[1], 10);
    const milliseconds = parseInt(timeComponents[2], 10);
    const totalSeconds = (minutes * 60) + seconds + milliseconds / 1000;
    return parseFloat(totalSeconds.toFixed(3));
}
const PositionChart = ({round, season, fastestLap = null, driverMapping}) => {
    let [loading, setLoading] = useState(true)
    let [dataset, setDataset] = useState([])
    let [showOutliers, setShowOutlier] = useState(false)

    useEffect(() => {
        (async () => {
            let data = await getLapByLaps(season, round)
            const positionObject = calculatePosition(data.Races[0].Laps)
            setDataset(positionObject)
            setLoading(false)
        })()
    }, [])

    const getLapTimes = (time) => {
        let fastestLapMS = fastestLap && convertTimeToSeconds(fastestLap)
        let currentLapMS = convertTimeToSeconds(time)
        if (fastestLap) {
            // return currentLapMS
            if ((currentLapMS / fastestLapMS) * 100 < 107)
                return currentLapMS
            else
                return null
        } else {
            return currentLapMS
        }
    }

    const calculatePosition = (laps) => {
        let answer = []
        let max = []
        laps.forEach((lap, index) => {
            let timingsArray = lap.Timings
            timingsArray.forEach(driver => {
                let temp = {
                    group: driverMapping[driver.driverId],
                    laps: lap.number,
                    position: parseInt(driver.position, 10),
                    time: getLapTimes(driver.time, false),
                    outlierTimes: convertTimeToSeconds(driver.time)
                }
                answer.push(temp)
            })
        })
        return answer
    }


    const showOutlier = () => {
        setShowOutlier(!showOutliers)
    }

    const positionPerLapChartOptions = {
        animations: false,
        axes: {
            bottom: {
                title: 'Laps',
                mapsTo: 'laps',
                scaleType: 'labels'
            },
            left: {
                mapsTo: 'position',
                title: 'Position',
                scaleType: 'linear'
            },
        },
        tooltip: {
            groupLabel: 'Driver',
            showTotal: false,
        },
        toolbar: {
            enabled: false
        },
        width: '100%',
        height: '600px',
        theme: 'g90'
    }

    const boxPlotOptions = {
        axes: {
            bottom: {
                title: 'Driver',
                mapsTo: 'group',
                scaleType: 'labels'
            },
            left: {
                mapsTo: showOutliers ? 'outlierTimes' : 'time',
                title: 'Time (s)',
                scaleType: 'log'
            },
        },
        tooltip: {
            groupLabel: 'Driver',
            showTotal: false,
        },
        toolbar: {
            enabled: false
        },
        width: '100%',
        height: '600px',
        theme: 'g90'
    }

    const lapTimesLineChartOption = {
        animations: false,
        axes: {
            bottom: {
                title: 'laps',
                mapsTo: 'laps',
                scaleType: 'labels'
            },
            left: {
                mapsTo: showOutliers ? 'outlierTimes' : 'time',
                title: 'Time (s)',
                scaleType: 'log'
            },
        },
        tooltip: {
            groupLabel: 'Driver',
            showTotal: false,
        },
        toolbar: {
            enabled: false,
        },
        width: '100%',
        height: '600px',
        theme: 'g90'
    }

    return <div style={{margin: `0 0 20px 0`}}>
        {loading ? 'Loading...' :
            <div>
                <div className={style.headingContainer}>
                    <h3 className={style.headings}> Driver Position Per Lap </h3>
                </div>
                <div className={style.chartBorder}>
                    <LineChart
                        data={dataset}
                        options={positionPerLapChartOptions}
                    ></ LineChart>
                </div>
                <div className={style.headingContainer}>
                    <h3 className={style.headings}>Drivers Lap timings (Box-plot) </h3>
                    <button className={style.toggleOutlier}
                            onClick={showOutlier}>{showOutliers ? 'Hide' : 'Show'} Outlier Laps
                    </button>
                </div>
                <div className={style.chartBorder}>
                    <BoxplotChart
                        data={dataset}
                        options={boxPlotOptions}
                    ></ BoxplotChart>
                </div>
                <div className={style.headingContainer}>
                    <h3 className={style.headings}>Drivers Lap timings (Line Chart) </h3>
                    <button className={style.toggleOutlier}
                            onClick={showOutlier}>{showOutliers ? 'Hide' : 'Show'} Outlier Laps
                    </button>
                </div>
                <div className={style.chartBorder}>
                    <LineChart
                        data={dataset}
                        options={lapTimesLineChartOption}
                    ></ LineChart>
                </div>
            </div>
        }
    </div>
}

export default PositionChart