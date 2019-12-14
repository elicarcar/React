import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

const CurrentWeather = props => {
  return (
    <div>
      <ResponsiveContainer height={400}>
        <BarChart
          height={400}
          data={props.currentWeather}
          className="area-chart"
          onClick={props.indexOnClick}
        >
          <defs>
            <linearGradient id="main" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eee" stopOpacity={1} />
              <stop offset="95%" stopColor="#eee" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="min" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="max" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="red" stopOpacity={0.8} />
              <stop offset="95%" stopColor="red" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name " />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            type="monotone"
            dataKey="main.temp"
            stroke="#888"
            fill="url(#main)"
            fillOpacity={1}
          />
          <Bar
            type="monotone"
            dataKey="main.temp_min"
            stroke="#8884d8"
            fill="url(#min)"
            fillOpacity={1}
          />
          <Bar
            type="monotone"
            dataKey="main.temp_max"
            stroke="red"
            fill="url(#max)"
            fillOpacity={1}
          />
          {/* <Brush dataKey="" height={40} stroke="#ad62aa" /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrentWeather;
