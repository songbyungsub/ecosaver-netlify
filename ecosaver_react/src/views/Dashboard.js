/* eslint-disable */
import { fontSize } from "@mui/system";
import React, { useState, PureComponent, useEffect, forwardRef } from "react";
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormSelect,
  CRow,
  CCol,
  CContainer,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
} from '@coreui/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CChartLine, CChart } from '@coreui/react-chartjs'
import { ko } from 'date-fns/esm/locale';
import '../assets/scss/date.css'
import { Spinner } from 'react-bootstrap';
import Swal from "sweetalert2";
import styled from 'styled-components';
import "chart.js/auto";
import { Line, Doughnut, Bar, HorizontalBar } from 'react-chartjs-2';
import { Chart } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { redirect } from "react-router-dom";


const Chartt = () => {
  const back_url = 'http://121.131.210.83/main/'
  const back_url2 = 'http://121.131.210.83/kepco'



  //변수
  const [month_week, setmonth_week] = useState('') //월, 주

  const [past_all, setpast_all] = useState('')//전국 작년
  const [now_all, setnow_all] = useState('') //전국 올해
  const [rate_all, setrate_all] = useState('') // 전국 절감률

  const [headquarter,setheadquarter] = useState('') //본부 이름
  const [past_headquarter, setpast_headquarter] = useState('') //본부 작년
  const [now_headquarter, setnow_headquarter] = useState('') //본부 올해
  const [rate_headquarter, setrate_headquarter] = useState('') // 본부 절감률
  

  const [center,setcenter] = useState('') //센터 이름
  const [past_center, setpast_center] = useState('') //센터 작년
  const [now_center, setnow_center] = useState('') //센터 올해
  const [rate_center, setrate_center] = useState('') // 센터 절감률
  const [max, setYMax] = useState('')

  const [topcenter,settopcenter] = useState('') //TOP5 센터 이름
  const [top_rate_center, settop_rate_center] = useState('') //TOP5 센터 절감률

  const [countaffair, setcountaffair] = useState('') // 센터별 담당 국사
  const [affairnum, setaffairnum] = useState('') // 국사 개수

  const [affair,setaffair] = useState('') //국사 이름
  const [past_affair, setpast_affair] = useState('') //국사 작년
  const [now_affair, setnow_affair] = useState('') //국사 올해
  const [rate_affair, setrate_affair] = useState('') // 국사 절감률
  const [selectedRadio, setSelectedRadio] = useState(''); // 선택된 센터

  const [affairlist, setaffairlist] = useState('') // 선택된 센터의 국사리스트
  const [selectaffair,setselectaffair] = useState('전체') // 선택된 국사
  // const sixMonthsAgo = new Date();
  // const [startDate, setStartDate] = useState(new Date()); //시작날짜
    // const [endDate, setEndDate] = useState(() => {
  //   const yesterday = new Date();
  //   yesterday.setDate(yesterday.getDate() - 1);
  //   return yesterday;
  // });
  const [endDate, setEndDate] = useState(new Date())
  const [daterange, setdaterange] = useState('') // weeklabel
  const [past_week, setpast_week] = useState('') //주차별 작년
  const [now_week, setnow_week] = useState('') // 주차별 올해
  const [rate_week, setrate_week] = useState('')// 주차별 절감률
  const [choice_center, setchoice_center] = useState('') // 선택한 센터

  //센터별 전력 사용률
  const [gangbuk, setgangbuk] = useState('') //전체
  const [core, setcore] = useState('') //코어운용샌터
  const [gangwon, setgangwon] = useState('')//강원액세스운용센터
  const [ict, setict] = useState('') // ict기술담당
  const [gyungki, setgyungki] = useState('') //경기북부
  const [seoul_g, setseoul_g] = useState('') // 서울강북


   //프로그래스
   const [loading, setLoading] = useState(false);
   const toggleLoading = (status) => {
     setLoading(status);
   };

   const [loading2, setLoading2] = useState(false);
   const toggleLoading2 = (status) => {
     setLoading2(status);
   };
 


  //시작 날짜 6개월 전으로 초기화
  const getSixMonthsAgo = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 6);
    return currentDate;
  };
  const [startDate, setStartDate] = useState(getSixMonthsAgo());


  //custom datepicker
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  // const handleRadioChange = (e) => {
  //   setSelectedRadio(e.target.value);
  // };


  //전국 전년도 대비 전력량
  useEffect(() => {
    const getall = async () => {
      let url = back_url + 'all_graph/'
      
      try {
        const response = await fetch(url, {
          method: 'POST',
        })

        const data = await response.json()
        if (data.returnCode === 'ok'){
          setpast_all(data.list.past) // 본부 작년
          setnow_all(data.list.now) // 본부 올해
          setrate_all(data.list.rate) // 본부 절감률
        }
        else {
        }
      } catch (error) {
        console.log(error)
      }
    };
    getall();
  }, [])




//본부별 전년도 대비 전력량
useEffect(() => {
    const getheadquarter = async () => {
      let url = back_url + 'headquarter_graph/'
      
      try {
        const response = await fetch(url, {
          method: 'POST',
        })

        const data = await response.json()
        if (data.returnCode === 'ok') {
          setmonth_week(data.list)
          setheadquarter(data.list.data.map(item => item.headquarter)) // 본부 이름
          setpast_headquarter(data.list.data.map(item => item.past)) // 본부 작년
          setnow_headquarter(data.list.data.map(item => item.now)) // 본부 올해
          setrate_headquarter(data.list.data.map(item => item.rate)) // 본부 절감률
          setgangbuk(data.list.data.find(item => item.headquarter === '강북/강원').now);
        }
        else {
        }
      } catch (error) {
        console.log(error)
      }
    };
    getheadquarter();
  }, [])

//전국 센터 절감률 TOP5
useEffect(() => {
  const gettopcenter= async () => {
    let url = back_url + 'center_topfive/'
    
    try {
      const response = await fetch(url, {
        method: 'POST',
      })

      const data = await response.json()
      if (data.returnCode === 'ok') {
        settopcenter(data.list.data.map(item => item.center)) // top5 센터 이름
        settop_rate_center(data.list.data.map(item => item.rate)) //top5 센터 절감률
      }
      else {
      }
    } catch (error) {
      console.log(error)
    }
  };
  gettopcenter();
}, [])


//센터별 전년도 대비 전력량
useEffect(() => {
  const getcenter = async () => {
    let url = back_url + 'center_graph/'
    
    try {
      const response = await fetch(url, {
        method: 'POST',
      })

      const data = await response.json()
      if (data.returnCode === 'ok') {
        const nowCenterData = data.list.data.map(item => item.now);
        const maxNowCenterValue = Math.max(...nowCenterData);
        const newYMaxValue = maxNowCenterValue * 1.8;

        
        setcenter(data.list.data.map(item => item.center)) // 센터 이름
        setpast_center(data.list.data.map(item => item.past)) // 센터 작년
        setnow_center(data.list.data.map(item => item.now)) // 센터 올해
        setrate_center(data.list.data.map(item => item.rate)) // 센터 절감률
        setYMax(newYMaxValue)

        //사용률을 위한 저장
        setcore(data.list.data.find(item => item.center === '강북/강원코어운용센터').now);
        setict(data.list.data.find(item => item.center === '강북/강원ICT기술담당').now)
        setseoul_g(data.list.data.find(item => item.center === '서울강북액세스운용센터').now)
        setgangwon(data.list.data.find(item => item.center === '강원액세스운용센터').now)
        setgyungki(data.list.data.find(item => item.center === '경기북부액세스운용센터').now)
      }
      else {
      }
    } catch (error) {
      console.log(error)
    }
  };
  getcenter();
}, [])


//센터별 담당 국사 개수
useEffect(() => {
  const getcontaffair = async () => {
    let url = back_url + 'gb_center_affair_num/'
    
    try {
      const response = await fetch(url, {
        method: 'POST',
      })

      const data = await response.json()
      if (data.returnCode === 'ok') {
        setcountaffair(data.list.map(item => item.center)) // 센터 이름
        setaffairnum(data.list.map(item => item.count)) //국사 개수
      }
      else {
      }
    } catch (error) {
      console.log(error)
    }
  };
  getcontaffair();
}, [])



//국사별 전년도 대비 전력량
const handleSelectaffair = async (selectedOption) => {
  setLoading2(true)
  try {
    const response = await fetch(back_url + 'center_affair_graph/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          center: selectedOption,
        },
      }),
    });

    const data = await response.json();

    if (data.returnCode === 'ok') {
        setaffair(data.list.data.map(item => item.affairs)) // 국사 이름
        setpast_affair(data.list.data.map(item => item.past)) // 국사 작년
        setnow_affair(data.list.data.map(item => item.now)) // 국사 올해
        setrate_affair(data.list.data.map(item => item.rate)) // 국사 절감률
    } else {
      // 에러 처리
      console.error(data.error);
    }
  } catch (error) {
    console.log(error.message);
  }
  setLoading2(false)
};

//국사별 전년도 default = 강북/강원 ICT기술담당
useEffect(() => {
  handleSelectaffair("강북/강원ICT기술담당");
}, []);



//센터 선택했을 때 해당 센터의 국사list
const handleSelectcenter = async (selectedOption) => {

  try {
    const response = await fetch(back_url + 'depthcenter/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          center: selectedOption,
        },
      }),
    });

    const data = await response.json();

    if (data.returnCode === 'ok') {
      setchoice_center(selectedOption)
      setaffairlist(data.list)
      setselectaffair(selectedOption)
    } else {
      // 에러 처리
      console.error(data.error);
    }
  } catch (error) {
    console.log(error.message);
  }

};

useEffect(() => {
  handleSelectcenter("전체");
}, []);


//선택된 국사 select
const handleaffairdata = (e) => {
  setselectaffair(e.target.value)
}


//조회버튼 클릭시
const handleSearch = async () => {
  setLoading(true);
  var ccenter = choice_center
  var  affairs = ccenter === '전체' ? '전체' : selectaffair;

  var searchData = {};
  searchData ={
    affairs,
    startdate: startDate.toISOString().slice(2, 10),
    enddate: endDate.toISOString().slice(2, 10)
  }

  try{
    const response = await fetch(back_url + 'center_affairs_rate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: searchData
      }),
    });

    const data = await response.json();

    if (data.returnCode === 'ok') {
      
      // setdaterange(data.list.map(item => item.week))
      // setpast_week(data.list.map(item => item.past))
      // setnow_week(data.list.map(item => item.now))
      // setrate_week(data.list.map(item => item.rate))

      // 추가된 코드: 해당 주차를 찾아서 삭제
      const updatedList = data.list.filter(item => item.week !== "3-1주차");

      // 추가된 코드: 업데이트된 리스트를 사용하여 UI 업데이트
      setdaterange(updatedList.map(item => item.week));
      setpast_week(updatedList.map(item => item.past));
      setnow_week(updatedList.map(item => item.now));
      setrate_week(updatedList.map(item => item.rate));

    }
    else {
      // 에러 처리
      console.error(data.error);
      Swal.fire({
        icon: 'error',
        title: '선택된 날짜의 데이터가 없습니다.',
        confirmButtonText: "확인",
      })
    }
  } catch (error) {
    console.log(error.message);
  }
  setLoading(false);
}



Chart.register(ChartDataLabels)

useEffect(() => {
    handleSearch();
  }, []);

  return (
    <CContainer fluid >
      <CRow>
        <CCol xs={3}>
          <CCard style={{ height: '21rem' }}>
            <CCardBody style={{ width: '100%', height: '100%' }}>
              <CCardTitle style={{fontSize:'16px'}}><b>전국 전년도 대비 "{month_week.month}월 {month_week.week}주차" 전력량 (Gw/h)</b></CCardTitle>
              <br></br>
              <div style={{ width: '100%', height: '16rem' }}>
                  <Line
                    type="line"
                    data={{
                      labels: ['23년도', '24년도'],
                      datasets: [
                        {
                          type: 'line',
                          label: '증감률',
                          borderColor: 'red',
                          backgroundColor: 'white',
                          borderWidth: 2, 
                          data: [,rate_all],
                          pointBackgroundColor: "white",
                          pointBorderColor: 'red',
                          pointRadius: 5,
                          yAxisID: 'y1',
                          datalabels:{
                            align: 'end',
                            anchor: 'end',
                            offset: -2,
                            color: 'black',
                            formatter: function(value){
                              return value + '%'
                            }
                          }
                        },
                        {
                          type: 'bar',
                          label: '전력량',
                          backgroundColor: ['	#c8c8c8', "#1E90FF"],
                          hoverBackgroundColor: ["#839091","#0D39DD"],
                          data: [past_all, now_all],
                          barPercentage: 0.5,
                          datalabels:{
                            align: 'end',
                            anchor: 'end',
                            color: 'black',
                            formatter: function(value){
                              return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                            }
                          }
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false, // 종횡비 유지 비활성화 -> 크기 조절
                      scales: {
                        x: {
                          grid: {
                            color: '#FCFCFC',
                            borderDash: [3, 3], // x축 점선으로 표시
                          },
                        },
                        y: {
                          maxBarThickness: 10,
                          beginAtZero:true,
                          max: 15000000 * 1.5,
                          ticks: {
                            display: false, // y축 눈금 숨김
                          },
                          grid: {
                            color: 'white',
                            borderDash: [5, 5], // y축 점선으로 표시
                            borderDashcolor: '#FCFCFC'
                          },
                          // display: true,
                          position: 'left',
                        },
                        y1: {
                          beginAtZero:false,
                          min: -300,
                          max: 60,
                          // display: true,
                          position: 'right',
                          // grid line settings
                          grid: {
                            color: 'white',
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                          },
                          ticks: {
                            display: false,
                            // stepSize: 0.5
                          }
                        },
                      },
                      plugins: {
                        
                        // legend: {
                        //   display: false,
                        // },
                      }
                    }}
                  />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard style={{ height: '21rem', position: 'relative' }}>
            <CCardBody style={{ width: '100%', height: '100%' }}>
              <CCardTitle><b>본부별 전년도 대비 "{month_week.month}월 {month_week.week}주차" 전력량 (Gw/h)</b></CCardTitle>
              <div style={{ width: '100%', height: '18rem' }}>
                <Line
                  style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                  type="line"

                  data={{
                    pointBorderColor: "black",
                    labels: headquarter,
                    datasets: [
                      {
                        type: 'line',
                        label: '증감률',
                        borderColor: 'red',
                        borderWidth: 2,
                        backgroundColor: 'white',
                        data: rate_headquarter,
                        pointBackgroundColor: "white",
                        pointBorderColor: "red",
                        pointRadius: 5,
                        yAxisID: 'y2',
                        datalabels:{
                          align: 'end',
                          anchor: 'end',
                          offset: -2,
                          color: 'black',
                          formatter: function(value){
                            return value + '%'
                          }
                        }
                      },
                      {
                        type: 'line',
                        label: '본부 목표 증감률(-5%)',
                        borderColor: 'green',
                        backgroundColor: 'white',
                        borderWidth: 2,
                        data:   [-5,-5,-5,-5,-5,-5,-5],
                        borderDash: [5, 5],
                        // pointBackgroundColor: "white",
                        // pointBorderColor: "red",
                        pointRadius: 0,
                        yAxisID: 'y2',
                        datalabels:{
                          display:false
                        }
                      },
                      {
                        type: 'bar',
                        label: '23년 전력량',
                        backgroundColor: '	#c8c8c8',
                        data: past_headquarter,
                        hoverBackgroundColor: ["#839091"],
                        // borderColor: 'red',
                        // borderWidth: 2,
                        datalabels:{
                          align: 'end',
                          // anchor: 'end',
                          color: 'black',
                          formatter: function(value){
                            return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                          }
                        }
                      },
                      {
                        type: 'bar',
                        label: '24년 전력량',
                        backgroundColor: "#1E90FF",
                        data: now_headquarter,
                        hoverBackgroundColor: ["#0D39DD"],
                        datalabels:{
                          align: 'end',
                          anchor: 'end',
                          color: 'black',
                          formatter: function(value){
                            return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                          }
                        }
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero:true,
                        max: Math.max(...now_headquarter) * 4,
                        ticks: {
                          display: false, // y축 눈금 숨김
                        },
                        grid: {
                          color: 'white',
                          borderDash: [3, 3], // y축 점선으로 표시
                        },
                      },
                      y2: {
                        beginAtZero:false,
                        min: Math.min(...rate_headquarter) * 2,
                        max: Math.max(...rate_headquarter) * -1.5,
                        position: 'right',
                        ticks: {
                          display: false,
                          // stepSize:0.1
                        },
                        grid: {
                          color: 'white',
                          borderDash: [3, 3],
                          drawOnChartArea: false,
                        },
                      },
                      x: {
                        grid: {
                          color: '#FCFCFC',
                          borderDash: [3, 3], // x축 점선으로 표시
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: true,
                      }
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={3}>
          <CCard style={{ height: '21rem' }}>
            <CCardBody style={{ width: '100%', height: '100%' }}>
              <CCardTitle><b>강북/강원 국사별 전년도 대비 증감률 TOP 5</b></CCardTitle>
              <br />
              <div style={{ width: '100%', height: '16rem' }}>
                <Bar
                  data={{
                    type: 'bar',
                    labels: [topcenter[0],topcenter[1],topcenter[2],topcenter[3],topcenter[4]],
                    datasets: [
                      {
                        label: '증감률',
                        backgroundColor: [
                          // 'rgba(255, 205, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(201, 203, 207, 0.2)',
                        ],
                        datalabels:{
                          align: 'start',
                          anchor: 'start',
                          offset: -2,
                          color: 'black',
                          formatter: function(value){
                            return value + '%'
                          }
                        },
                        hoverBackgroundColor: ["#CBCE91"],
                        data: [top_rate_center[0],top_rate_center[1],top_rate_center[2],top_rate_center[3],top_rate_center[4]],
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    indexAxis: 'y', // x축을 수직으로 변경  la
                    scales: {
                      y: {
                        position: 'right',
                        // max: 15000000 * 1.5,
                        grid: {
                          color: '#FCFCFC',
                          borderDash: [3, 3], // y축 점선으로 표시
                        },
                        ticks: {
                          
                        },
                      },
                      x: {
                        min: Math.max(...top_rate_center)*2,
                        ticks: {
                          display: false,
                          
                        },
                        grid: {
                          color: '#FCFCFC',
                          borderDash: [3, 3], // x축 점선으로 표시
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      }
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={8}>
          <CCard style={{ height: '31rem', position: 'relative' }}>
            <CCardBody >
              <CCardTitle><b>"강북/강원 광역본부" 센터별 전년도 대비 "{month_week.month}월 {month_week.week}주차" 전력량 (Gw/h)</b></CCardTitle>
              <div style={{ width: '100%', height: '28rem' }}>
                <Line
                  style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                  type="line"
                  data={{
                    labels: center,
                    datasets: [
                      {
                        type: 'line',
                        label: '증감률',
                        borderColor: 'red',
                        borderWidth: 2,
                        data: rate_center,
                        backgroundColor: 'white',
                        pointBackgroundColor: "white",
                        pointBorderColor: "red",
                        pointRadius: 5,
                        yAxisID: 'y1',
                        datalabels:{
                          align: 'start',
                          anchor: 'start',
                          offset: -2,
                          color: 'black',
                          formatter: function(value){
                            return value + '%'
                          }
                        }
                      },
                      {
                        type: 'line',
                        label: '본부 목표 증감률(-5%)',
                        borderColor: 'green',
                        backgroundColor: 'white',
                        borderWidth: 2,
                        data:   [-5,-5,-5,-5,-5],
                        borderDash: [5, 5],
                        // pointBackgroundColor: "white",
                        // pointBorderColor: "red",
                        pointRadius: 0,
                        yAxisID: 'y1',
                        datalabels:{
                          display:false
                        }
                      },
                      {
                        type: 'bar',
                        label: '23년 전력량',
                        backgroundColor: '#c8c8c8',
                        data: past_center,
                        hoverBackgroundColor: ["#839091"],
                        // borderWidth: 2,
                        datalabels:{
                          color: 'black',
                          formatter: function(value){
                            return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                          }
                        }
                      },
                      {
                        type: 'bar',
                        label: '24년 전력량',
                        backgroundColor: '#1E90FF',
                        data: now_center,
                        hoverBackgroundColor: ["#0D39DD"],
                        datalabels:{
                          color: 'black',
                          formatter: function(value){
                            return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                          }
                        }
                      },
                      
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero:true,
                        max: Math.max(...now_center) * 2.5,
                        ticks: {
                          display: false, // y축 눈금 숨김
                        },
                        grid: {
                          color: 'white',
                          borderDash: [3, 3], // y축 점선으로 표시
                          borderDashcolor: '#FCFCFC'
                        },
                        position: 'left'
                      },
                      y1: {
                        beginAtZero:false,
                        min: Math.min(...rate_headquarter) * 2,
                        max: Math.max(...rate_headquarter) * -1.5,
                        // display: true,
                        position: 'right',
                        // grid line settings
                        grid: {
                          color: 'white',
                          drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                        ticks: {
                          display: false,
                          // stepSize: 0.5
                        }
                      },
                      y3: {
                        beginAtZero:false,
                        min: -300,
                        max: 50,
                        position: 'right',
                        ticks: {
                          display: false,
                        },
                        grid: {
                          color: 'white',
                          borderDash: [3, 3],
                          drawOnChartArea: false,
                        },
                      },
                      x: {
                        grid: {
                          color: '#FCFCFC',
                          borderDash: [3, 3], // x축 점선으로 표시
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      }
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={4}>
          <CCard style={{ height: '31rem', position: 'relative' }}>
            <CCardBody >
              <CCardTitle><b>강북/강원 센터별 "{month_week.month}월 {month_week.week}주차" 전력 사용률</b></CCardTitle>
              <div style={{ width: '100%', height: '28rem' }}>
                <Doughnut
                  style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                  type="doughnut"
                  data={{
                    labels: ['경기북부액세스','강원액세스','서울강북액세스','ICT기술담당','강북/강원 코어'],
                    datasets: [
                      {
                        label: '사용률',
                        // data: affairnum,
                        data: [Math.round((gyungki/gangbuk)*100), Math.round((gangwon/gangbuk)*100),Math.round((seoul_g/gangbuk)*100),
                        Math.round((ict/gangbuk)*100), Math.round((core/gangbuk)*100)],
                        backgroundColor: ['#FF7E9D', "#BEF5BE",'#1E96FF','#D27D32','#FFEB5A'],
                        datalabels:{
                          color: 'black',
                          font:{
                            size: 13
                          },
                          formatter: function(value){
                            return value + '%'
                          }
                        }
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        // position: 'right',
                      },
                    },
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      
      <CRow>
        <CCol>
          <CCard style={{ height: '29rem', position: 'relative' }}>
          {loading2 && ( // 로딩 중일 때만 spinner 표시
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            <CCardBody >
              <CCardTitle><b>"강북/강원 광역본부" 국사별 전년도 대비 "{month_week.month}월 {month_week.week}주차" 전력량 (Gw/h)</b></CCardTitle>
              <CRow xs={{ cols: 'auto' }}>
                <CCol>
                  <br></br>
                  <span><b>센터</b></span>
                  <br></br>
                  <CFormSelect
                    // style={{width : '25%'}}
                    aria-label="Default select example"
                    // value={selectedRadio}  // 현재 선택된 값을 value로 설정
                    options={[
                      // '선택',
                      { label: '강북/강원ICT기술담당', value: '강북/강원ICT기술담당' },
                      { label: '강북/강원코어운용센터', value: '강북/강원코어운용센터' },
                      { label: '서울강북액세스운용센터', value: '서울강북액세스운용센터' },
                      { label: '강원액세스운용센터', value: '강원액세스운용센터' },
                      { label: '경기북부액세스운용센터', value: '경기북부액세스운용센터' },
                    ]}
                    defaultValue="강북/강원ICT기술담당"
                    onChange={(e) => handleSelectaffair(e.target.value)}
                  >
                  </CFormSelect>
                </CCol>
                {/* <CCol>
                <br></br>
                  <br></br>
                <CButton color="success" variant="outline">조회</CButton>
                </CCol> */}
              </CRow>
              <CRow>
              <div style={{ width: '100%', height: '19rem' }}>
              <br></br>
                <Line
                  style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                  type="line"
                  data={{
                    labels: affair,
                    datasets: [
                      {
                        type: 'line',
                        label: '증감률',
                        borderColor: 'red',
                        backgroundColor: 'white',
                        borderWidth: 2,
                        data: rate_affair,
                        pointBackgroundColor: "white",
                        pointBorderColor: "red",
                        pointRadius: 5,
                        yAxisID: 'y1',
                        datalabels:{
                          align: 'start',
                          anchor: 'start',
                          offset: -2,
                          color: 'black',
                          formatter: function(value){
                            return value + '%'
                          }
                        }
                      },
                      {
                        type: 'line',
                        label: '본부 목표 증감률(-5%)',
                        borderColor: 'green',
                        backgroundColor: 'white',
                        borderWidth: 2,
                        data: Array(rate_affair.length).fill(-5),
                        borderDash: [5, 5],
                        // pointBackgroundColor: "white",
                        // pointBorderColor: "red",
                        pointRadius: 0,
                        yAxisID: 'y1',
                        datalabels:{
                          display:false
                        }
                      },
                      {
                        type: 'bar',
                        label: '23년 전력량',
                        backgroundColor: '#c8c8c8',
                        data: past_affair,
                        hoverBackgroundColor: ["#839091"],
                        // borderWidth: 2,
                        datalabels:{
                          color: 'black',
                          formatter: function(value){
                            return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                          }
                        }
                      },
                      {
                        type: 'bar',
                        label: '24년 전력량',
                        backgroundColor: '#1E90FF',
                        hoverBackgroundColor: ["#0D39DD"],
                        data: now_affair,
                        datalabels:{
                          color: 'black',
                          formatter: function(value){
                            return Math.round(value /1000).toLocaleString('en-AU') + 'G'
                          }
                        }
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero:true,
                        max: Math.max(...now_affair) * 2.5,
                        ticks: {
                          display: false, // y축 눈금 숨김
                        },
                        grid: {
                          color: 'white',
                          borderDash: [3, 3], // y축 점선으로 표시
                          borderDashcolor: '#FCFCFC'
                        },
                        position: 'left',
                      },

                      x: {
                        grid: {
                          color: '#FCFCFC',
                          borderDash: [3, 3], // x축 점선으로 표시
                        },
                      },
                      y1: {
                        beginAtZero:false,
                        min: -300,
                        max: 70,
                        // display: true,
                        position: 'right',
                        // grid line settings
                        grid: {
                          color: 'white',
                          drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                        ticks: {
                          display: false,
                          // stepSize: 0.5
                        }
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      }
                    }
                  }}
                />
              </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      <CRow>
        <CCol>
          <CCard style={{ height: '29rem', position: 'relative' }}>
          {loading && ( // 로딩 중일 때만 spinner 표시
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}
            <CCardBody >
              <CCardTitle><b>"강북/강원 광역본부" 국사별 전년도 대비 주차별(week) 전력량 (Gw/h)</b></CCardTitle>
              <CRow xs={{ cols: 'auto' }}>
                <CCol>
                  <br></br>
                  <span><b>센터</b></span>
                  <br></br>
                  <CFormSelect
                    // style={{width : '25%'}}
                    aria-label="Default select example"
                    options={[
                      {label: '전체', value: '전체' },
                      { label: '강북/강원ICT기술담당', value: '강북/강원ICT기술담당' },
                      { label: '강북/강원코어운용센터', value: '강북/강원코어운용센터' },
                      { label: '서울강북액세스운용센터', value: '서울강북액세스운용센터' },
                      { label: '강원액세스운용센터', value: '강원액세스운용센터' },
                      { label: '경기북부액세스운용센터', value: '경기북부액세스운용센터' },
                    ]}
                    defaultValue="전체"
                    onChange={(e) => handleSelectcenter(e.target.value)}
                  >
                  </CFormSelect>
                </CCol>
                <CCol>
                  <br></br>
                  <span><b>국사</b></span>
                  <br></br>
                  <CFormSelect
                    // style={{width : '25%'}}
                    aria-label="Default select example"
                    value={selectaffair}
                    options={[
                      { label: '전체', value: choice_center },
                        ...Array.from({ length: affairlist.length }, (_, index) => (
                          { label: affairlist[index], value: affairlist[index] }
                        )),
                      ]}
                      defaultValue='전체' 
                      onChange={handleaffairdata}
                  >
                  </CFormSelect>
                </CCol>
                {/* {selectaffair && ( */}
                  <>
                  <CCol className="no-gutters" style={{ width: '13rem', marginRight: '-10px' }}>
                  <br></br>
                  <span><b>날짜</b></span>
                  <br></br>
                  <DatePicker
                  customInput={<ExampleCustomInput />}
                  locale={ko}
                  dateFormat="yyyy년 MM월 dd일"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
                </CCol>
                <CCol className="no-gutters" style={{ marginTop: '7px', marginLeft: '-10px', marginRight: '-10px' }}>
                  <br></br><br></br>
                  <span ><b>부터</b></span>
                </CCol>
                <CCol className="no-gutters" style={{ width: '13rem', marginRight: '-10px' }}>
                  <br></br>
                  <br></br>
                  <DatePicker
                  customInput={<ExampleCustomInput />}
                  locale={ko}
                  dateFormat="yyyy년 MM월 dd일"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
              />
                </CCol>
                </>
                {/* )} */}


                
                <CCol className="no-gutters" style={{ width: '7rem', marginLeft: '-10px' }}>
                <br></br>
                  <br></br>
                <CButton color="success" onClick={handleSearch} variant="outline">조회</CButton>
                </CCol>
              </CRow>
              <CRow>

                <div style={{ width: '100%', height: '19rem' }}>
                  <br></br>
                  <Line
                    style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                    type="line"
                    data={{
                      labels: daterange,
                      datasets: [
                        {
                          type: 'line',
                          label: '증감률',
                          borderColor: 'red',
                          backgroundColor: 'white',
                          borderWidth: 2,
                          data: rate_week,
                          pointBackgroundColor: "white",
                          pointBorderColor: "red",
                          pointRadius: 5,
                          yAxisID: 'y1',
                          datalabels:{
                            align: 'end',
                            anchor: 'end',
                            offset: -2,
                            color: 'black',
                            formatter: function(value){
                              return value + '%'
                            }
                          }
                        },
                        {
                          type: 'line',
                          label: '본부 목표 증감률(-5%)',
                          borderColor: 'green',
                          backgroundColor: 'white',
                          borderWidth: 2,
                          data: Array(rate_week.length).fill(-5),
                          borderDash: [5, 5],
                          // pointBackgroundColor: "white",
                          // pointBorderColor: "red",
                          pointRadius: 0,
                          yAxisID: 'y1',
                          datalabels:{
                            display:false
                          }
                        },
                        {
                          type: 'bar',
                          label: '전년도 전력량',
                          backgroundColor: '#c8c8c8',
                          hoverBackgroundColor: ["#839091"],
                          // borderWidth: 2,
                          data: past_week,
                          datalabels:{
                            // color: 'black',
                            // formatter: function(value){
                            //   return value.toLocaleString('en-AU') + 'kw/h'
                            // }
                            display:false,
                          }
                        },
                        {
                          type: 'bar',
                          label: '기준년도 전력량',
                          backgroundColor: '#1E90FF',
                          data: now_week,
                          hoverBackgroundColor: ["#0D39DD"],
                          datalabels:{
                            // color: 'black',
                            // formatter: function(value){
                            //   return value.toLocaleString('en-AU') + 'kw/h'
                            // }
                            display:false,
                          }
                        },
                      ],
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero:true,
                          max:Math.max(...now_week) * 2 ,
                          ticks: {
                            display: false, // y축 눈금 숨김
                          },
                          grid: {
                            color: 'white',
                            borderDash: [3, 3], // y축 점선으로 표시
                          },
                          position: 'left',
                        },
                        y1: {
                          beginAtZero:false,
                          min: Math.min(...rate_week) * 4,
                          max: Math.max(...rate_week) * 1.5 === 0 ? 2 : Math.max(...rate_week) * 1.5,
                          // display: true,
                          position: 'right',
                          // grid line settings
                          grid: {
                            color: 'white',
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                          },
                          ticks: {
                            display: false,
                            // stepSize: 0.5
                          }
                        },
                        x: {
                          grid: {
                            color: 'white',
                            borderDash: [3, 3], // x축 점선으로 표시
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: false,
                        }
                      }
                    }}
                  />
                </div>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* <CRow>
        <CButton color="success" onClick={download_excel}>
          어제 날짜 데이터 다운로드
        </CButton>
      </CRow> */}

    </CContainer>
  );
};

export default Chartt;





//week주차 셀렉트 용
{/* <CCol className="no-gutters" style={{ width: '8rem', marginRight: '-10px' }}>
<br></br>
<span><b>날짜</b></span>
<br></br>
<CFormSelect
  // style={{width : '50%'   }}
  aria-label="Default select example"
  // value={selectedRadio}  // 현재 선택된 값을 value로 설정
  options={[
    '선택',
    { label: '01월', value: '1' },
    { label: '02월', value: '2' },
    { label: '03월', value: '3' },
    { label: '04월', value: '4' },
    { label: '05월', value: '5' },
    { label: '06월', value: '6' },
    { label: '07월', value: '7' },
    { label: '08월', value: '8' },
    { label: '09월', value: '9' },
    { label: '10월', value: '10' },
    { label: '11월', value: '11' },
    { label: '12월', value: '12' },
  ]}
  // onChange={handleRadioChange}
>
</CFormSelect>
</CCol>
<CCol className="no-gutters" style={{ width: '9rem', marginLeft: '-10px', marginRight: '-10px' }}>
<br></br>
<br></br>
<CFormSelect
  // style={{width : '50%', justifyContent: 'flex-start'}}
  aria-label="Default select example"
  // value={selectedRadio}  // 현재 선택된 값을 value로 설정
  options={[
    '선택',
    { label: '1주차', value: 'quarter' },
    { label: '2주차', value: 'half' },
    { label: '3주차', value: 'hour' },
    { label: '4주차', value: 'day' },
    { label: '5주차', value: 'month' },
  ]}
// onChange={handleRadioChange}
>
</CFormSelect>
</CCol>
<CCol className="no-gutters" style={{ marginTop: '7px', marginLeft: '-10px', marginRight: '-10px' }}>
<br></br><br></br>
<span ><b>부터</b></span>
</CCol>
<CCol className="no-gutters" style={{ width: '8rem', marginRight: '-10px' }}>
<br></br>
<br></br>
<CFormSelect
  // style={{width : '50%'   }}
  aria-label="Default select example"
  // value={selectedRadio}  // 현재 선택된 값을 value로 설정
  options={[
    '선택',
    { label: '01월', value: '1' },
    { label: '02월', value: '2' },
    { label: '03월', value: '3' },
    { label: '04월', value: '4' },
    { label: '05월', value: '5' },
    { label: '06월', value: '6' },
    { label: '07월', value: '7' },
    { label: '08월', value: '8' },
    { label: '09월', value: '9' },
    { label: '10월', value: '10' },
    { label: '11월', value: '11' },
    { label: '12월', value: '12' },
  ]}
  // onChange={handleRadioChange}
>
</CFormSelect>
</CCol>
<CCol className="no-gutters" style={{ width: '9rem', marginLeft: '-10px', marginRight: '-10px' }}>
<br></br>
<br></br>
<CFormSelect
  // style={{width : '50%', justifyContent: 'flex-start'}}
  aria-label="Default select example"
  // value={selectedRadio}  // 현재 선택된 값을 value로 설정
  options={[
    '선택',
    { label: '1주차', value: 'quarter' },
    { label: '2주차', value: 'half' },
    { label: '3주차', value: 'hour' },
    { label: '4주차', value: 'day' },
    { label: '5주차', value: 'month' },
  ]}
// onChange={handleRadioChange}
>
</CFormSelect>
</CCol> */}