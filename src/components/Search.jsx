import React, { useState, useEffect } from 'react';
import axios from 'axios';
import stateCodes from './states.json';
import Graph from './graph/graph';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import clock from './clock.svg'

export default function Search() {
    const [data, setData] = useState();
    const [historicData, setHistoricData] = useState();
    const [plotData, setPlotData] = useState();
    const xyValues = [];
    const [curr, setCurr] = useState({
        confirmed: null,
        active: null,
        recovered: null,
        deceased: null
    });
    const [ytd, setYtd] = useState({
        confirmed: null,
        active: null,
        recovered: null,
        deceased: null
    });

    const fetchData = async () => {
        try {
            const timeseriesData = await axios.get(`https://data.covid19india.org/v4/min/timeseries.min.json`);
            const fetched = await axios.get(`https://data.covid19india.org/v4/min/data.min.json`);
            setData(fetched);
            setHistoricData(timeseriesData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    function resetStates(){
        setCurr({
            confirmed: null,
            active: null,
            recovered: null,
            deceased: null
        });
        setYtd({
            confirmed: null,
            active: null,
            recovered: null,
            deceased: null
        });
        setPlotData()
    }

    function handleSearch(e) {
        resetStates();
        const dict = stateCodes.filter(item =>
            item.name.toLowerCase() === e.target.value.toLowerCase())[0];
        const code = (dict) ? dict.code : null;
        
        // State code is not present in State_code.json
        // Therefore, entered value is not a state, but 
        // most probably a district
        if (!code) {
            const stateKey = Object.keys(data.data);
            for (let idx = 0; idx < stateKey.length; idx++) {
                const currDistricts = data.data[stateKey[idx]].districts ?
                    Object.keys(data.data[stateKey[idx]].districts) :
                    null;

                if (currDistricts !== null) {
                    for (let loc = 0; loc < currDistricts.length; loc++) {
                        if (currDistricts[loc].toLowerCase() === e.target.value.toLowerCase()) {
                            setCurr({
                                confirmed: data.data[stateKey[idx]].districts[currDistricts[loc]].total['confirmed'],
                                active: data.data[stateKey[idx]].districts[currDistricts[loc]].total['active'] ?
                                    data.data[stateKey[idx]].districts[currDistricts[loc]].total['active'] :
                                    data.data[stateKey[idx]].districts[currDistricts[loc]].total['recovered'] &&
                                        data.data[stateKey[idx]].districts[currDistricts[loc]].total['deceased'] ?
                                        data.data[stateKey[idx]].districts[currDistricts[loc]].total['confirmed'] -
                                        data.data[stateKey[idx]].districts[currDistricts[loc]].total['recovered'] -
                                        data.data[stateKey[idx]].districts[currDistricts[loc]].total['deceased'] :
                                        null,
                                recovered: data.data[stateKey[idx]].districts[currDistricts[loc]].total['recovered'],
                                deceased: data.data[stateKey[idx]].districts[currDistricts[loc]].total['deceased']
                            });
                            break
                        }
                    };
                }
            }
        }

        // State code is present in State-code.json
        // Therefore, entered value is definitely a state
        if (code) {
            //setting today's stats
            setCurr({
                confirmed: data.data[code].total['confirmed'],
                active: data.data[code].total['active'] ?
                    data.data[code].total['active'] :
                    data.data[code].total['recovered'] &&
                        data.data[code].total['deceased'] ?
                        data.data[code].total['confirmed'] -
                        data.data[code].total['recovered'] -
                        data.data[code].total['deceased'] :
                        null,
                recovered: data.data[code].total['recovered'],
                deceased: data.data[code].total['deceased']
            });
            
            //setting yesterday's stats
            const prev = Object.entries(historicData.data[code].dates)[Object.entries(historicData.data[code].dates).length-2][1];
            setYtd({
                confirmed: data.data[code].total['confirmed']-prev.total.confirmed,
                recovered: data.data[code].total['recovered']-prev.total.recovered,
                deceased: data.data[code].total['deceased']-prev.total.deceased
            });

            //setting graph
            Object.entries(historicData.data[code].dates).forEach(([date, value]) => {
                if (date >= '2021-01-01') {
                    xyValues.push(
                        {
                            xValues: date,
                            confirmed: value.total.confirmed ? value.total.confirmed : 0,
                            active: value.total.active ? value.total.active : 0,
                            recovered: value.total.recovered ? value.total.recovered : 0,
                            deceased: value.total.deceased ? value.total.deceased : 0
                        }
                    );
                }
                setPlotData(xyValues)
            });
        }
    }

    var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var hr= today.getHours();
var min=today.getMinutes();

today = dd + '/' + mm + '/' + yyyy + ', ' + hr + ':'+min+' IST';
    return (
        <div className='search-container'>
           
            <div className='search-box-container'>
                <span className='search-icon-container'>
                    <FontAwesomeIcon icon={faSearch} size='lg'/>
                </span>
                <input className='search-box w_90per h_40px'
                    type="text" id="header-search"
                    name="search-field" onChange={handleSearch} placeholder='District or State'/>
                    <span>{today} <img id='clock' src={clock} alt="clock" /></span>
            </div>
            
            <div className='output'>
                <div className="stats-containers confirmed">
                    <span className='block-level stats-head'>Confirmed</span>
                    <span className='block-level '>+{ytd['confirmed'] ? ytd['confirmed'] : 0}</span>
                    <span className='block-level stats-current'>{curr['confirmed'] ? curr['confirmed'] : 0}</span>
                    <span className='block-level '><Graph plotData={plotData} field="confirmed" color="#ff1043" /></span>
                </div>
                <div className="stats-containers active">
                    <span className='block-level stats-head'>Active</span>
                    <span className='block-level'></span>
                    <span className='block-level stats-current'>{curr['active'] ? curr['active'] : 0}</span>
                    <span className='block-level'><Graph plotData={plotData} field="active" color="#037aff" /></span>
                </div>
                <div className="stats-containers recovered">
                    <span className='block-level stats-head'>Recovered</span>
                    <span className='block-level'>+{ytd['recovered'] ? ytd['recovered'] : 0}</span>
                    <span className='block-level stats-current'>{curr['recovered'] ? curr['recovered'] : 0}</span>
                    <span className='block-level'><Graph plotData={plotData} field="recovered" color="#33ab4f" /></span>
                </div>
                <div className="stats-containers deceased">
                    <span className='block-level stats-head'>Deceased</span>
                    <span className='block-level'>+{ytd['deceased'] ? ytd['deceased'] : 0}</span>
                    <span className='block-level stats-current'>{curr['deceased'] ? curr['deceased'] : 0}</span>
                    <span className='block-level'><Graph plotData={plotData} field="deceased" color="#6c767f" /></span>
                </div>
            </div>

        </div>
    )
}