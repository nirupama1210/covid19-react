import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';


export default function Graph({plotData, field, color}) {
    return (
        <ResponsiveContainer width="100%" aspect={3}>
        <LineChart
          width={100}
          height={200}
          data={plotData}
        >
          <Line dataKey={field} stroke={color} strokeWidth={3} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    )
}