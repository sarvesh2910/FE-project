'use client'
import { React, useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import LastRace from './components/lastrace';

const Home = () => {

    return (
        <div className='container'>
            <LastRace></LastRace>
        </div>
    );
};

export default Home;

