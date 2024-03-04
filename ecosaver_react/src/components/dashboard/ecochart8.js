/* eslint-disable */
import React, { Component, Fragment, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CChartLine, CChart } from '@coreui/react-chartjs'

const ecochart8 = () => {

  
    return (
        <CChart
  type="bubble"
  data={{
    datasets: [{
      label: 'First Dataset',
      data: [{
        x: 20,
        y: 30,
        r: 15
      }, {
        x: 40,
        y: 10,
        r: 10
      }, {
        x: 30,
        y: 20,
        r: 30
      }],
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  }}
  options={{
    plugins: {
      legend: {
        labels: {
        //   color: getStyle('--cui-body-color'),
        }
      }
    },
    scales: {
      x: {
        grid: {
        //   color: getStyle('--cui-border-color-translucent'),
        },
        ticks: {
        //   color: getStyle('--cui-body-color'),
        },
      },
      y: {
        grid: {
        //   color: getStyle('--cui-border-color-translucent'),
        },
        ticks: {
        //   color: getStyle('--cui-body-color'),
        },
      },
    },
  }}
/>
    )
  };
  
  export default ecochart8;