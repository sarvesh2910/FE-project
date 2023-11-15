import React from "react";
import Link from "next/link";
import style from './nav.module.css';

const Navbar = () => {
    return (
            <div className={style.container}>
                <div className={style.logo}>
                    <Link href={'/'}>F1 Logo</Link>
                </div>
                <div className={style.links}>
                    <Link href="/teams">
                        <p>Teams</p>
                    </Link>
                    <Link href="/drivers">
                        <p>Drivers</p>
                    </Link>
                    <Link href="/races">
                        <p>Races</p>
                    </Link>
                </div>
                <div className={style.search}>
                    <input
                        className={style.searchBar}
                        placeholder={'search'}
                        type="text"/>
                </div>
            </div>

    );
};

export default Navbar;
