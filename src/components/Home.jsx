import React from 'react'
import Overall from './Overall';
import Search from './Search';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';



export default function Home() {


    return (
        <>
            <nav>
                <div id="d1">
                    Covid Tracker
                </div>
                <Link to="/state">
                    <div className='rt'>
                        <button >
                            States
                        </button>
                        <div>
                        <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    </div>
                </Link>
            </nav>
            <Overall />
            <Search />
        </>
    )
}