import React from 'react'
import Overall from './Overall';
import Search from './Search';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import State from './State';



export default function Home() {


    return (
        <div className='main-content'>
            <nav>
                <div id="d1">
                    COVID-19 Tracker
                </div>
               
            </nav>
            <Overall />
            <Search />
            <State />
        </div>
    )
}