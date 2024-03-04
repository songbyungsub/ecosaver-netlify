/* eslint-disable */
import React, { Component, Fragment, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CChartLine, CChart } from '@coreui/react-chartjs'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const ecochart3 = () => {
    
  
    return (
        <CChart
        type="line" 
        data={{
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgba(220, 220, 220, 0.2)",
                borderColor: "rgba(220, 220, 220, 1)",
                pointBackgroundColor: "rgba(220, 220, 220, 1)",
                pointBorderColor: "#fff",
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40]
            },
            {
                label: "My Second dataset",
                backgroundColor: "rgba(151, 187, 205, 0.2)",
                borderColor: "rgba(151, 187, 205, 1)",
                pointBackgroundColor: "rgba(151, 187, 205, 1)",
                pointBorderColor: "#fff",
                data: [50, 12, 28, 29, 7, 25, 12, 70, 60]
            },
            ],
        }}
        options={{
            plugins: {
            legend: {
                labels: {
                // color: getStyle('--cui-body-color'),
                }
            }
            },
            scales: {
            x: {
                grid: {
                // color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                // color: getStyle('--cui-body-color'),
                },
            },
            y: {
                grid: {
                // color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                // color: getStyle('--cui-body-color'),
                },
            },
            },
        }}
        />
    )
  };
  
  export default ecochart3;


