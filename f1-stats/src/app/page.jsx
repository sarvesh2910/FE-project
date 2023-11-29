'use client'
import { React, useState, useEffect } from 'react';
import LastRace from './components/lastrace';

const Home = () => {

    return (
        <div className='container'>
            <div class="row">
                <div class="col-lg-8">
                <LastRace></LastRace>
                </div>
            </div>
        </div>
    );
};

export default Home;

