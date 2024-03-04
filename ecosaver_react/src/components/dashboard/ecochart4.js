/* eslint-disable */
import React, { Component, Fragment, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CChartLine, CChart } from '@coreui/react-chartjs'

const ecochart4 = () => {

  
    return (
        <CChart
        type="scatter"
        data={{
          datasets: [{
            label: '분포도',
            data: [{
              x: -10,
              y: 6
            }, {
              x: 0,
              y: 3
            }, {
              x: 10,
              y: 5
            }, {
              x: 0.5,
              y: 5.5
            },
            {
                x: -6,
                y: 4
              },
              {
                x: -8,
                y: 9
              },
              {
                x: 8,
                y: 1
              }],
            backgroundColor: 'rgb(255, 99, 132)'
          }],
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
              position: 'bottom',
              ticks: {
                // color: getStyle('--cui-body-color'),
              },
              type: 'linear',
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
  
  export default ecochart4;