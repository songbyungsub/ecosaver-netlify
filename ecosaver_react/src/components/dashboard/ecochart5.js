/* eslint-disable */
import React, { Component, Fragment, useRef, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CChartLine, CChart } from '@coreui/react-chartjs'

const ecochart5 = () => {

  
    return (
        <CChart 
        type="radar"
        data={{
          labels: [
            'Eating',
            'Drinking',
            'Sleeping',
            'Designing',
            'Coding',
            'Cycling',
            'Running',
          ],
          datasets: [
            {
              label: 'My First dataset',
              backgroundColor: 'rgba(220, 220, 220, 0.2)',
              borderColor: 'rgba(220, 220, 220, 1)',
              pointBackgroundColor: 'rgba(220, 220, 220, 1)',
              pointBorderColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220, 220, 220, 1)',
              data: [65, 59, 90, 81, 56, 55, 40],
            },
            {
              label: 'My Second dataset',
              backgroundColor: 'rgba(151, 187, 205, 0.2)',
              borderColor: 'rgba(151, 187, 205, 1)',
              pointBackgroundColor: 'rgba(151, 187, 205, 1)',
              pointBorderColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(151, 187, 205, 1)',
              data: [28, 48, 40, 19, 96, 27, 100],
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
            r: {
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
  
  export default ecochart5;