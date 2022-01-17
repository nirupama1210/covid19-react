import React, { useState, useEffect} from 'react'
import axios from 'axios'

export default function Overall() {

const [post, setPost] = useState({date:null, total:null});

const fetchData = async () => {
    try {
        const response = await axios.get(`https://data.covid19india.org/v4/min/data.min.json`)
        // tranform your response and then set it to state at once
        const total =  Object.entries(response.data).map(([k,v])=>
                                                            v.total.confirmed
                                                        ).reduce((prev, curr)=>prev+curr,0)
        const date = new Date(Object.entries(response.data)[0][1].meta.last_updated)
        setPost({date: date.toLocaleString('en-US', {dateStyle: 'medium', timeStyle: 'medium'})+' IST', total});
        // console.log();
    } catch(err) {
        console.log(err);
    }
}

useEffect(() => {
    fetchData()  
}, []);

return (
    <div className='overall-container'>
        <div>
            <span className='country'>India</span>
            <span className='date'>Last updated on {post?.date}</span>
        </div>
        <div>
            <span className='color_ADABDC'>Tested</span>
            <span className='total'>{ new Intl.NumberFormat('en-IN').format(post?.total)}</span>
            {(post.date!==null && <span className='color_ADABDC'>As of {post?.date.slice(0, 5)}</span>)}
            <span className='color_ADABDC'>per source</span>
        </div>

    </div>
  )
}