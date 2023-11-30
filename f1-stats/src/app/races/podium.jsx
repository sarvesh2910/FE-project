'use client'
import React, {useEffect, useState} from "react";
import style from './podium.module.css'

const Podium = ({data}) => {
    return <div className={style.podiumContainer}>
        <div className={style.partition}>
            <p>{data.second}</p>
            <div className={`${style.step} ${style.stepTwo}`}>2</div>
        </div>
        <div className={style.partition}>
            <p>{data.first}</p>
            <div className={`${style.step} ${style.stepOne}`}>1</div>
        </div>
        <div className={style.partition}>
            <p>{data.third}</p>
            <div className={`${style.step} ${style.stepThree}`}>3</div>
        </div>
    </div>
}
export default Podium