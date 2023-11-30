'use client'
import {React} from 'react';
import LastRace from './components/lastrace';
import HomeDash from "@/app/components/home";


const Home = () => {
    return (
        <div className=''>
            <div className="">
                <div className="">
                    <LastRace></LastRace>
                    <HomeDash/>
                </div>
            </div>
        </div>
    );
};

export default Home;

