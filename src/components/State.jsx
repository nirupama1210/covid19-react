import React, { useState, useEffect } from 'react';
import axios from 'axios';
import stateCodes from './states.json';
import { Link } from 'react-router-dom';
import { faArrowUp, faAngleUp, faAngleDown, faAngleLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function State() {
    const [stateStats, setStateStats] = useState([]);
    const fetchData = async () => {
        try {
            const timeseriesData = await axios.get(`https://data.covid19india.org/v4/min/timeseries.min.json`);
            const userStateCodeList = stateCodes.map(item => item.code);
            const stateCodeList = Object.keys(timeseriesData.data).filter(item => userStateCodeList.includes(item));
            const arr = stateCodeList.map(stateCode => ({

                name: stateCodes.filter(item => item.code === stateCode)[0]['name'],
                confirmed: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.confirmed,
                active: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.confirmed -
                    timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.recovered -
                    timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.deceased,
                recovered: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.recovered,
                deceased: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.deceased,
                tested: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.tested,
                recovery_ratio: parseFloat(timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.recovered /
                    (timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.confirmed -
                        timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.recovered -
                        timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.deceased)).toFixed(3),

                confirmed_raised: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.confirmed -
                    timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 2]].total.confirmed,
                recovered_raised: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.recovered -
                    timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 2]].total.recovered,
                deceased_raised: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.deceased -
                    timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 2]].total.deceased,
                tested_raised: timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 1]].total.tested -
                    timeseriesData.data[stateCode].dates[Object.keys(timeseriesData.data[stateCode].dates)[Object.keys(timeseriesData.data[stateCode].dates).length - 2]].total.tested

            }));
            setStateStats(arr);
        } catch (err) {
            console.log(err);
        }
    }

    function convertToInternationalCurrencySystem(labelValue) {
        return Math.abs(Number(labelValue)) >= 1.0e+9

            ? (Math.abs(Number(labelValue)) / 1.0e+7).toFixed(2) + "Cr"
            : Math.abs(Number(labelValue)) >= 1.0e+5

                ? (Math.abs(Number(labelValue)) / 1.0e+5).toFixed(2) + "L"
                : Math.abs(Number(labelValue)) >= 1.0e+3

                    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

                    : Math.abs(Number(labelValue));
    }

    function upSort(sortBy) {
        const sorted = sortBy === "name" ? stateStats.sort((a, b) =>
            a[sortBy] > b[sortBy] ? 1 : -1
        ) : stateStats.sort((a, b) =>
            a[sortBy] - b[sortBy]
        );
        setStateStats([...sorted]);
    }
    function downSort(sortBy) {
        const sorted = sortBy === "name" ? stateStats.sort((a, b) =>
            b[sortBy] > a[sortBy] ? 1 : -1
        ) : stateStats.sort((a, b) =>
            b[sortBy] - a[sortBy]
        );
        setStateStats([...sorted]);
    }

    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <nav>
                <Link to="/">
                    <div className='lt'>
                        <div><FontAwesomeIcon icon={faAngleLeft} /></div>
                        <button>Home</button>
                    </div>
                </Link>
            </nav>
            <table>
                <thead>
                    <tr>
                        <th className='t-a sortable'>
                            <div>
                                <div>State/UT</div>
                                <div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleUp} onClick={() => upSort("name")} /></div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleDown} onClick={() => downSort("name")} /></div>
                                </div>
                            </div>
                        </th>
                        <th className='sortable'>
                            <div>
                                <div>Confirmed</div>
                                <div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleUp} onClick={() => upSort("confirmed")} /></div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleDown} onClick={() => downSort("confirmed")} /></div>
                                </div>
                            </div>
                        </th>
                        <th>Active</th>
                        <th className='sortable'>
                            <div>
                                <div>Recovered</div>
                                <div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleUp} onClick={() => upSort("recovered")} /></div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleDown} onClick={() => downSort("confirmed")} /></div>
                                </div>
                            </div>
                        </th>
                        <th className='sortable'>
                            <div>
                                <div>Deceased</div>
                                <div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleUp} onClick={() => upSort("deceased")} /></div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleDown} onClick={() => downSort("deceased")} /></div>
                                </div>
                            </div>
                        </th>
                        <th className='sortable'>
                            <div>
                                <div>Tested</div>
                                <div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleUp} onClick={() => upSort("tested")} /></div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleDown} onClick={() => downSort("tested")} /></div>
                                </div>
                            </div>
                        </th>
                        <th className='sortable'>
                            <div>
                                <div>Recovery Ratio</div>
                                <div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleUp} onClick={() => upSort("recovery_ratio")} /></div>
                                    <div><FontAwesomeIcon className="icon" icon={faAngleDown} onClick={() => downSort("recovery_ratio")} /></div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {stateStats.map(currState => {
                        return <tr key={currState.name}>
                            <th className='state-name t-a sortable'>
                                <div>
                                    <div>{currState.name}</div>
                                    <div className='info'><FontAwesomeIcon icon={faInfoCircle} size='lg'/></div>
                                    <div className='hide'>{currState.recovery_ratio}</div> 
                                </div>
                            </th>
                            <td>
                                <div className='confirmed'>
                                    <span><FontAwesomeIcon icon={faArrowUp} /></span>
                                    <span>{currState.confirmed_raised}</span>
                                </div>
                                <div>
                                    {new Intl.NumberFormat('en-IN').format(currState.confirmed)}
                                </div>
                            </td>
                            <td>
                                <div>
                                    {new Intl.NumberFormat('en-IN').format(currState.active)}
                                </div>
                            </td>
                            <td>
                                <div className='recovered'>
                                    <span><FontAwesomeIcon icon={faArrowUp} /></span>
                                    <span>{currState.recovered_raised}</span>

                                </div>
                                <div>
                                    {new Intl.NumberFormat('en-IN').format(currState.recovered)}
                                </div>
                            </td>
                            <td>
                                <div className='deceased'>
                                    <span><FontAwesomeIcon icon={faArrowUp} /></span>
                                    <span>{currState.deceased_raised}</span>

                                </div>
                                <div>
                                    {new Intl.NumberFormat('en-IN').format(currState.deceased)}
                                </div>
                            </td>
                            <td>
                                <div className='tested'>
                                    <span><FontAwesomeIcon icon={faArrowUp} /></span>
                                    <span>{convertToInternationalCurrencySystem(currState.tested_raised)}</span>

                                </div>
                                <div>
                                    {convertToInternationalCurrencySystem(currState.tested)}
                                </div>
                            </td>
                            <td className='recovery-ratio'>{currState.recovery_ratio}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </>
    )
}