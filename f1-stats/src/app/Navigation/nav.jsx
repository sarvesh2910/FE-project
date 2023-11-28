'use client'
import React from "react";
import Link from "next/link";
import Image from 'next/image'
import style from './nav.module.css';
import {usePathname} from 'next/navigation'

const Navbar = () => {
    const pathname = usePathname()
    return (
        <div className={style.container}>
            <div className={style.content}>
                <div className={style.logo}>
                    <Link href={'/'}>
                        <Image
                            width={100}
                            height={80}
                            src={'/F1.svg'}></Image>
                    </Link>
                </div>
                <div className={style.navButtonContainer}>
                    <Link className={style.navButtons} href="/teams">
                        <p>Teams</p>
                        {pathname === '/teams' && <div className={style.borders}/>}
                    </Link>
                    <Link className={style.navButtons} href="/drivers">
                        <p>Drivers</p>
                        {pathname === '/drivers' && <div className={style.borders}/>}
                    </Link>
                    <Link className={style.navButtons} href="/races">
                        <p>Races</p>
                        {pathname === '/races' && <div className={style.borders}/>}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
