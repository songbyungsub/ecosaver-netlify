/* eslint-disable */
import React, { useEffect, useRef } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";


// const data = {
//   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//   datasets: [{
//     label: 'Try hiding me',
//     data: [65, 59, 80, 81, 26, 55, 40],
//     fill: false,
//     borderColor: 'rgb(75, 192, 192)',
//   }]
// };

// const config = {
//   type: 'line',
//   data: data,
//   options: {
//     transitions: {
//       show: {
//         animations: {
//           x: {
//             from: 0
//           },
//           y: {
//             from: 0
//           }
//         }
//       },
//       hide: {
//         animations: {
//           x: {
//             to: 0
//           },
//           y: {
//             to: 0
//           }
//         }
//       }
//     }
//   }
// };

// const ecochart = () => {
//   return (
//     <div>
//       <Card>
//         <CardBody>
//           <CardTitle tag="h5">라인 차트</CardTitle>
//           <CardSubtitle className="mb-2 text-muted" tag="h6">
//             전력량 분석
//           </CardSubtitle>
//             {/* {config} */}
//             config
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default ecochart;


const ecochart = () => {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const createChart = () => {
      Chart.register(
        LineController,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement
      );
      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["24년 1월", "24년 2월", "24년 3월", "24년 4월", "24년 5월", "24년 6월","24년 7월"],
          datasets: [
            {
              label: "KW",
              data: [0, 20, 50, 40, 70, 100,40],
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              pointRadius: 5, // 포인트 크기
              pointBackgroundColor: "rgba(255, 99, 132, 1)", // 포인트 배경색
              pointBorderColor: "rgba(255, 255, 255, 1)", // 포인트 테두리 색
              pointHoverRadius: 7, // 호버 시 포인트 크기
              pointHoverBackgroundColor: "rgba(255, 99, 132, 1)", // 호버 시 포인트 배경색
              pointHoverBorderColor: "rgba(255, 255, 255, 1)", // 호버 시 포인트 테두리 색
              fill: false, // 라인 그래프에서 영역 채우기 비활성화
            },
          ],
        },
        options: {
          scales: {
            x: {
              display: true,
            },
            y: {
              beginAtZero: true,
              max: 150, // 최대값 설정
            },
          },
        },
      });
    };

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    };

    const initializeChart = () => {
      destroyChart(); // 이전 차트 파괴
      createChart(); // 새로운 차트 생성
    };

    // 컴포넌트가 처음 렌더링될 때 차트 초기화
    initializeChart();

    // 컴포넌트가 unmount될 때 차트 파괴
    return () => {
      destroyChart();
    };
  }, []);

  return <canvas ref={chartRef} />;
 
};

export default ecochart;