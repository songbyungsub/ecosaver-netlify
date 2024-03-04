/* eslint-disable */
import React, { Component, Fragment, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CChartLine, CChart } from '@coreui/react-chartjs'

const ecochart6 = () => {

  
    return (
        <CChart
  type="doughnut"
  data={{
    labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [40, 20, 80, 10],
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
  }}
/>
    )
  };
  
  export default ecochart6;