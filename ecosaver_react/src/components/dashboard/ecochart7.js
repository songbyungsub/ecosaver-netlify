/* eslint-disable */
import React, { Component, Fragment, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CChartLine, CChart } from '@coreui/react-chartjs'

const ecochart7 = () => {

  
    return (
        <CChart
  type="polarArea"
  data={{
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
      },
    ],
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
      r: {
        grid: {
        //   color: getStyle('--cui-border-color'),
        },
      }
    }
  }}
/>
    )
  };
  
  export default ecochart7;