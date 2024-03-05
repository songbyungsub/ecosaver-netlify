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
  CFormSwitch,
} from '@coreui/react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CChartLine, CChart } from '@coreui/react-chartjs'
import { ko } from 'date-fns/esm/locale';
import Swal from "sweetalert2";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../assets/scss/date.css'
// import { endOfMonth, setMonth } from 'date-fns'
// import moment from 'moment';
import axios from 'axios'
import { Spinner } from 'react-bootstrap';
import {Chart} from 'chart.js'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { colourOptions } from '../data';
import { Await } from "react-router-dom";
import "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'react-chartjs-2';

const animatedComponents = makeAnimated();

const Power = () => {
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  };

  //date picker
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedRadio, setSelectedRadio] = useState('');

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
    //날짜 선택시 초기화
    setStartDate(new Date());
    setEndDate(new Date());
  };

  // 국사별 전력 데이터 저장
  const [affairData, setAffairData] = useState([]);

  //변수
  const [headquarter, setHeadquarter] = useState(''); //본부
  const [affair, setaffair] = useState(''); //국사
  const [chartaffair, setchartaffair] = useState('') //차트에 들어가는 affiar
  const [data_length, setdata_length] = useState('') //데이터 갯수

  const [selectaffair, setselectaffair] = useState('전체'); //국사초기화용
  const [power, setpower] = useState('') //전력 총 데이터

  const [time, settime] = useState('') //시간
  const [kwh, setkwh] = useState('') // 전력
  const [unit, setunit] = useState('') // x축 라벨

  //축조정
  const [beginAtZero, setBeginAtZero] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const back_url = 'http://127.0.0.1:8000/main/'

  //프로그래스1
  const [loading, setLoading] = useState(false);
  const toggleLoading = (status) => {
    setLoading(status);
  };

  //축 조정
  const handleSwitchChange = () => {
    setBeginAtZero((prevValue) => !prevValue);
  };

  //본부
  useEffect(() => {
    // toggleLoading(true);
    const getRegion = async () => {
      let url = back_url + 'depthheadquarter/'
      setaffair([]);
      try {
        const response = await fetch(url, {
          method: 'POST',
        })

        const data = await response.json()
        if (data.returnCode === 'ok') {
          setHeadquarter(data.list)
        }
        else {
        }
      } catch (error) {
        console.log(error)
      }
    };
    getRegion();
  }, [])

  //국사
  const handleSelectaffair = async (selectedOption) => {
    // toggleLoading(true);
    setaffair([]);
    try {
      const response = await fetch(back_url + 'depthaffair/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            headquarter: selectedOption,
          },
        }),
      });

      const data = await response.json();

      if (data.returnCode === 'ok') {
        setaffair(data.list)
      } else {
        // 에러 처리
        console.error(data.error);
      }
    } catch (error) {
      console.log(error.message);
    }

  };

  // select 다중 선택 값들 list에 담기
  const handleaffairdata = (e) => {
    const selectedValues = e.map((option) => option.value);
    if (selectedValues.includes('전체')) {
      //전체를 제외한 모든 옵션들
      setselectaffair(affair.filter((option) => option !== '전체'));
    } else {
      //아니면 그냥 선택한 옵션들
      setselectaffair(selectedValues);
    }
  }

  // "전체"를 포함한 한개씩 받기
  // const handleSearch_power = async () => {
  //   setLoading(true);
  //   setAffairData([]);
  //   setunit('kW/h')


  //   if (selectaffair === '전체') {
  //     const promises = affair.map(async (selectedAffair) => {
  //       let searchData = {};

  //       if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: endDate.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       } else if (selectedRadio === "month") {
  //         const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
  //         lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: lastDayOfMonth.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       } else if (selectedRadio === "year") {
  //         const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
  //         lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: lastDayOfYear.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       } else if (selectedRadio === "day") {
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: endDate.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       }

  //       const result = await fetchData_power(searchData);

  //       if (result) {
  //         // 국사 데이터 추가
  //         setAffairData((prevData) => [
  //           ...prevData,
  //           {
  //             label: selectedAffair,
  //             time_list: result.time_list,
  //             ele_list: result.ele_list,
  //           },
  //         ]);
  //       }
  //     });

  //     await Promise.all(promises);
  //   }
  //   else {
  //     let searchData = {};

  //     if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: endDate.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     } else if (selectedRadio === "month") {
  //       const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
  //       lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: lastDayOfMonth.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     } else if (selectedRadio === "year") {
  //       const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
  //       lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: lastDayOfYear.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     } else if (selectedRadio === "day") {
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: endDate.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     }

  //     const result = await fetchData_power(searchData);

  //     if (result) {
  //       setAffairData([
  //         {
  //           label: selectaffair,
  //           time_list: result.time_list,
  //           ele_list: result.ele_list,
  //         },
  //       ]);
  //     }
  //   }

  //   setLoading(false); // 로딩 종료
  // };

  //전력량 조회 버튼 클릭 --> 다중 선택 searchdata 담기
  const handleSearch_power = async () => {
    setLoading(true);
    setAffairData([]);
    setunit('kW/h');

    try {
      const promises = selectaffair.map(async (selectedAffair) => {
        let searchData = {};

        if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: endDate.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        } else if (selectedRadio === "month") {
          const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
          lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: lastDayOfMonth.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        } else if (selectedRadio === "year") {
          const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
          lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: lastDayOfYear.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        } else if (selectedRadio === "day") {
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: endDate.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        }

        const result = await fetchData_power(searchData);

        if (result) {
          // 국사 데이터 추가
          setAffairData((prevData) => [
            ...prevData,
            {
              label: selectedAffair,
              time_list: result.time_list,
              ele_list: result.ele_list,
            },
          ]);
        }
      });

      // 모든 비동기 작업이 완료될 때까지 대기
      await Promise.all(promises);
    } catch (error) {
      console.error(error.message);
    }

    setLoading(false); // 로딩 종료
  };


  //전력량 조회 버튼 클릭 --> searchdata로 request
  const fetchData_power = async (searchData) => {
    try {
      const response = await fetch(back_url + 'quarterpower/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: searchData,
        }),
      });

      const data = await response.json();



      if (data.returnCode === 'ok') {
        // console.log(data)
        const time_list = [];
        const ele_list = [];
        setchartaffair(data.list.affair)
        setdata_length(data.list.length)


        data.list.data.map((value, index) => {
          const roundedpower = Math.round(value.power);
          if (selectedRadio === "quarter") {
            time_list.push(value.date.replace('T', ' ').slice(5, 16));
            ele_list.push(roundedpower);
          } else if (selectedRadio === "half") {
            time_list.push(value.date.replace('T', ' ').slice(5, 16));
            ele_list.push(roundedpower);
          } else if (selectedRadio === "hour") {
            time_list.push(value.date.replace('T', ' ').slice(5, 13));
            ele_list.push(roundedpower);
          } else if (selectedRadio === "day") {
            time_list.push(value.date.slice(0, 10));
            ele_list.push(roundedpower);
          } else if (selectedRadio === "month") {
            time_list.push(value.date.slice(0, 7));
            ele_list.push(roundedpower);
          } else if (selectedRadio === "year") {
            time_list.push(value.date.slice(0, 4));
            ele_list.push(roundedpower);
          }
        });

        // console.log(data.list)
        return { time_list, ele_list };
        // console.log(ele_list
      } else {
        // Handle the error
        console.error(data.error);
        Swal.fire({
          icon: 'error',
          title: '선택된 날짜의 데이터가 없습니다.',
          confirmButtonText: "확인",
        });
        return null;
      }
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  // "전체"를 포함한 한개씩 받기
  // const handleSearch_cost = async () => {
  //   setLoading(true);
  //   setAffairData([]);
  //   setunit('원')

  //   if (selectaffair === '전체') {
  //     const promises = affair.map(async (selectedAffair) => {
  //       let searchData = {};

  //       if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: endDate.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       } else if (selectedRadio === "month") {
  //         const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
  //         lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: lastDayOfMonth.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       } else if (selectedRadio === "year") {
  //         const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
  //         lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: lastDayOfYear.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       } else if (selectedRadio === "day") {
  //         searchData = {
  //           affair: selectedAffair,
  //           startDate: startDate.toISOString().slice(2, 10),
  //           endDate: endDate.toISOString().slice(2, 10),
  //           selectedRadio: selectedRadio,
  //         };
  //       }

  //       const result = await fetchData_cost(searchData);

  //       if (result) {
  //         // 국사 데이터 추가
  //         setAffairData((prevData) => [
  //           ...prevData,
  //           {
  //             label: selectedAffair,
  //             time_list: result.time_list,
  //             ele_list: result.ele_list,
  //           },
  //         ]);
  //       }
  //     });

  //     await Promise.all(promises);
  //   }
  //   else {
  //     let searchData = {};

  //     if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: endDate.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     } else if (selectedRadio === "month") {
  //       const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
  //       lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: lastDayOfMonth.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     } else if (selectedRadio === "year") {
  //       const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
  //       lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: lastDayOfYear.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     } else if (selectedRadio === "day") {
  //       searchData = {
  //         affair: selectaffair,
  //         startDate: startDate.toISOString().slice(2, 10),
  //         endDate: endDate.toISOString().slice(2, 10),
  //         selectedRadio: selectedRadio,
  //       };
  //     }

  //     const result = await fetchData_cost(searchData);

  //     if (result) {
  //       setAffairData([
  //         {
  //           label: selectaffair,
  //           time_list: result.time_list,
  //           ele_list: result.ele_list,
  //         },
  //       ]);
  //     }
  //   }

  //   setLoading(false); // 로딩 종료
  // };

  //전력비 조회 버튼 클릭 --> 다중 선택 searchdata 담기
  const handleSearch_cost = async () => {
    setLoading(true);
    setAffairData([]);
    setunit('원')

    try {
      const promises = selectaffair.map(async (selectedAffair) => {
        let searchData = {};

        if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: endDate.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        } else if (selectedRadio === "month") {
          const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
          lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: lastDayOfMonth.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        } else if (selectedRadio === "year") {
          const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
          lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: lastDayOfYear.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        } else if (selectedRadio === "day") {
          searchData = {
            affair: selectedAffair,
            startDate: startDate.toISOString().slice(2, 10),
            endDate: endDate.toISOString().slice(2, 10),
            selectedRadio: selectedRadio,
          };
        }

        const result = await fetchData_cost(searchData);

        if (result) {
          // 국사 데이터 추가
          setAffairData((prevData) => [
            ...prevData,
            {
              label: selectedAffair,
              time_list: result.time_list,
              ele_list: result.ele_list,
            },
          ]);
        }
      });

      // 모든 비동기 작업이 완료될 때까지 대기
      await Promise.all(promises);
    } catch (error) {
      console.error(error.message);
    }

    setLoading(false); // 로딩 종료
  };



  //전력비 조회 버튼 클릭 --> searchdata로 request
  const fetchData_cost = async (searchData) => {
    try {
      const response = await fetch(back_url + 'quarterpower/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: searchData,
        }),
      });

      const data = await response.json();



      if (data.returnCode === 'ok') {
        // console.log(data)
        const time_list = [];
        const ele_list = [];
        setchartaffair(data.list.affair)
        setdata_length(data.list.length)

        data.list.data.map((value, index) => {
          const roundcost = Math.round(value.cost);
          if (selectedRadio === "quarter") {
            time_list.push(value.date.replace('T', ' ').slice(5, 16));
            ele_list.push(roundcost);
          } else if (selectedRadio === "half") {
            time_list.push(value.date.replace('T', ' ').slice(5, 16));
            ele_list.push(roundcost);
          } else if (selectedRadio === "hour") {
            time_list.push(value.date.replace('T', ' ').slice(5, 13));
            ele_list.push(roundcost);
          } else if (selectedRadio === "day") {
            time_list.push(value.date.slice(0, 10));
            ele_list.push(roundcost);
          } else if (selectedRadio === "month") {
            time_list.push(value.date.slice(0, 7));
            ele_list.push(roundcost);
          } else if (selectedRadio === "year") {
            time_list.push(value.date.slice(0, 4));
            ele_list.push(roundcost);
          }
        });

        // console.log(data.list)
        return { time_list, ele_list };
        // console.log(ele_list
      } else {
        // Handle the error
        console.error(data.error);
        Swal.fire({
          icon: 'error',
          title: '선택된 날짜의 데이터가 없습니다.',
          confirmButtonText: "확인",
        });
        return null;
      }
    } catch (error) {
      console.log(error.message);
      return null;
    }
  };

  useEffect(() => {
    const updateChart = () => {
      setChartData({
        labels: affairData.length > 0 ? affairData[0].time_list : [],
        datasets: affairData.map((data, index) => ({
          datalabels: {
            display: false,
          },
          label: data.label,
          borderColor: `rgba(${getRandomColor().r}, ${getRandomColor().g}, ${getRandomColor().b}, 1)`,
          pointBackgroundColor: "white",
          pointRadius: data_length > 100 ? 1 : 3,
          data: data.ele_list,
        })),
      });
    };

    // 스위치 값이 변경될 때마다 차트 업데이트
    updateChart();
  }, [beginAtZero, affairData, data_length]);


  return (
    <div>
      <CContainer fluid >
        <CRow>
          <CCol xs={1} style={{ width: '13rem' }}>
            <span><b>본부</b></span>
            <CFormSelect

              aria-label="Default select example"
              options={[
                '선택',
                { label: headquarter[0], value: headquarter[0] },
                { label: headquarter[1], value: headquarter[1] },
                { label: headquarter[2], value: headquarter[2] },
                { label: headquarter[3], value: headquarter[3] },
                { label: headquarter[4], value: headquarter[4] },
                { label: headquarter[5], value: headquarter[5] },
                { label: headquarter[6], value: headquarter[6] },
                { label: headquarter[7], value: headquarter[7] },
                { label: headquarter[8], value: headquarter[8] },
              ]}
              onChange={(e) => handleSelectaffair(e.target.value)}
            />
          </CCol>
          <CCol xs={3}>
            <span><b>국사</b></span>
            {/* <CFormSelect
              // style={{ width: '8rem' }}
              aria-label="Default select example"
              // value={setdefaultall}/
              options={[
                { label: "전체", value: '전체' },
                ...Array.from({ length: affair.length }, (_, index) => (
                  { label: affair[index], value: affair[index] }
                )),
              ]}
              onChange={handleaffairdata}
            /> */}
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              // value={setdefaultall}/
              options={[
                { label: "전체", value: '전체' },
                ...Array.from({ length: affair.length }, (_, index) => (
                  { label: affair[index], value: affair[index] }
                )),
              ]}
              onChange={handleaffairdata}
            />
          </CCol>
          <CCol xs={1}>
            <span><b>기간</b></span>
            <CFormSelect
              aria-label="Default select example"
              value={selectedRadio}  // 현재 선택된 값을 value로 설정
              options={[
                '선택',
                { label: '15분', value: 'quarter' },
                { label: '30분', value: 'half' },
                { label: '1시간', value: 'hour' },
                { label: '일별', value: 'day' },
                { label: '월별', value: 'month' },
                { label: '년별', value: 'year' },
              ]}
              onChange={handleRadioChange} // 선택 시 상태 업데이트
            >
            </CFormSelect>
          </CCol>


          {selectedRadio === "quarter" ||
            selectedRadio === "half" ||
            selectedRadio === "hour" ? (
            <CCol xs={2} style={{ marginLeft: '10px', alignItems: 'flex-end' }}>
              {/* <br></br> */}
              <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 </b></span>
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
              <span style={{ marginLeft: '60px', display: 'flex', alignItems: 'flex-end', marginTop: '5px', marginBottom: '5px' }}><b>부터</b></span>
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
          ) : null}

          {selectedRadio === "day" ? (
            <>
              <CCol xs={2} style={{ marginLeft: '10px', alignItems: 'flex-end' }}>
                {/* <br></br> */}
                <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 </b></span>
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
                <span style={{ marginLeft: '60px', display: 'flex', alignItems: 'flex-end', marginTop: '5px', marginBottom: '5px' }}><b>부터</b></span>
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
          ) : null}

          {selectedRadio === "month" ? (
            <>
              <CCol xs={2} style={{ marginLeft: '10px', alignItems: 'flex-end' }}>
                <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 </b></span>
                <DatePicker
                  customInput={<ExampleCustomInput />}
                  locale={ko}
                  dateFormat="yyyy년 MM월"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  showMonthYearPicker
                />
                <span style={{ marginLeft: '45px', display: 'flex', alignItems: 'flex-end', marginTop: '5px', marginBottom: '5px' }}><b>부터</b></span>
                <DatePicker
                  customInput={<ExampleCustomInput />}
                  locale={ko}
                  dateFormat="yyyy년 MM월"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  showMonthYearPicker
                />
              </CCol>
            </>
          ) : null}

          {selectedRadio === "year" ? (
            <>
              <CCol xs={1} style={{ marginLeft: '10px', alignItems: 'flex-end' }}>
                {/* <br></br> */}
                <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 </b></span>
                <DatePicker
                  customInput={<ExampleCustomInput />}
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy년"
                  showYearPicker
                />
                <span style={{ marginLeft: '25px', display: 'flex', alignItems: 'flex-end', marginTop: '5px', marginBottom: '5px' }}><b>부터</b></span>
                <DatePicker
                  customInput={<ExampleCustomInput />}
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="yyyy년"
                  showYearPicker
                />
              </CCol>
            </>
          ) : null}

          <CCol xs={2}>
            <br></br>
            <CButton style={{ fontSize: '15px' }} onClick={handleSearch_power} color="success" variant="outline">전력량 조회</CButton>
            <CButton style={{ marginLeft: '15px', fontSize: '15px' }} onClick={handleSearch_cost} color="success" variant="outline">전력비 조회</CButton>
          </CCol>
        </CRow>

        <br></br>
        <CRow>
          <CCard style={{ width: '100rem', height: '50rem', position: 'relative' }}>
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


            {unit === 'kW/h' && (
              <CCardBody style={{ width: '100%', height: '100%' }}>
                <CCardTitle><b>전력 사용 현황</b></CCardTitle>
                <br></br>
                <CFormSwitch
                  label="체크시 y축 0부터 시작"
                  id="range_start"
                  // defaultChecked={beginAtZero}
                  onChange={handleSwitchChange}
                />
                <br></br>
                <div style={{ width: '100%', height: '42rem' }}>
                  <Line
                    style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                    type="line"
                    //data GPT 참조
                    data={{
                      labels: affairData.length > 0 ? affairData[0].time_list : [],
                      datasets: affairData.map((data, index) => ({
                        datalabels: {
                          display: false
                        },
                        label: data.label,
                        // backgroundColor: `rgba(${getRandomColor().r}, ${getRandomColor().g}, ${getRandomColor().b}, 0.2)`, 
                        borderColor: `rgba(${getRandomColor().r}, ${getRandomColor().g}, ${getRandomColor().b}, 1)`,
                        pointBackgroundColor: "white",
                        // pointBorderColor: "black",
                        pointRadius: data_length > 100 ? 1 : 3,
                        data: data.ele_list,
                      })),
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {},
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const datasetLabel = context.dataset.label || '';
                              const value = context.parsed.y.toLocaleString('en-AU') + ' kW/h';
                              return datasetLabel + ': ' + value;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {},
                          ticks: {},
                        },
                        y: {
                          beginAtZero: beginAtZero,
                          grid: {},
                          ticks: {
                            callback: (value) => Math.round(value).toLocaleString('en-AU') + 'kW/h',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CCardBody>
            )}

            {unit === '원' && (
              <CCardBody style={{ width: '100%', height: '100%' }}>
                <CCardTitle><b>전력비 청구 현황</b></CCardTitle>
                <br></br>
                <CFormSwitch
                  label="체크시 y축 0부터 시작"
                  id="range_start"
                  // defaultChecked={beginAtZero}
                  onChange={handleSwitchChange}
                />
                <br></br>
                <div style={{ width: '100%', height: '42rem' }}>
                  <Line
                    style={{ width: '100%', height: '100%', maxHeight: '100%' }}
                    type="line"
                    //data GPT 참조
                    data={{
                      labels: affairData.length > 0 ? affairData[0].time_list : [],
                      datasets: affairData.map((data, index) => ({
                        datalabels: {
                          display: false
                        },
                        label: data.label,
                        // backgroundColor: `rgba(${getRandomColor().r}, ${getRandomColor().g}, ${getRandomColor().b}, 0.2)`, 
                        borderColor: `rgba(${getRandomColor().r}, ${getRandomColor().g}, ${getRandomColor().b}, 1)`,
                        pointBackgroundColor: "white",
                        pointBorderColor: "black",
                        pointRadius: data_length > 100 ? 1 : 3,
                        data: data.ele_list,
                      })),
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {},
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const datasetLabel = context.dataset.label || '';
                              const value = context.parsed.y.toLocaleString('en-AU') + ' 원';
                              return datasetLabel + ': ' + value;
                            },
                          },
                        },

                      },
                      scales: {
                        x: {
                          grid: {},
                          ticks: {},
                        },
                        y: {
                          beginAtZero: beginAtZero,
                          grid: {},
                          ticks: {
                            callback: (value) => Math.round(value).toLocaleString('en-AU') + '원',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </CCardBody>
            )}
          </CCard>

        </CRow>
      </CContainer>

    </div>
  );
};

export default Power;




//바차트 
{/* <CChart
  type="bar"
  data={{
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: '22년 전력 사용량',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
      },
      {
        label: '23년 전력 사용량',
        backgroundColor: '#FFFF00',
        data: [50, 10, 53, 19, 30, 20, 19, 60, 50],
      },
    ],
  }}
  labels="months"
  options={{
    plugins: {
      legend: {
        labels: {
          // color: getStyle('--cui-body-color'),
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y + ' KW';
            return datasetLabel + ': ' + value;
          },
        },
      },
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
          callback: (value) => value + 'KW', // 
        },
      },
    },
  }}
/> */}




//조회 버튼 클릭

// const handleSearch = async () => {
//   setLoading(true);
//   var searchData = {}
//  // "전체" 일 때
// if (selectaffair === '전체') {
//   for (const selectedAffair of affair) {
//     if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
//       searchData = {
//         affair: selectedAffair,
//         startDate: startDate.toISOString().slice(2, 10),
//         endDate: endDate.toISOString().slice(2, 10),
//         selectedRadio: selectedRadio,
//       };
//     } else if (selectedRadio === "month") {
//       const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
//       lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
//       searchData = {
//         affair: selectedAffair,
//         startDate: startDate.toISOString().slice(2, 10),
//         endDate: lastDayOfMonth.toISOString().slice(2, 10),
//         selectedRadio: selectedRadio,
//       };
//     } else if (selectedRadio === "year") {
//       const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
//       lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
//       searchData = {
//         affair: selectedAffair,
//         startDate: startDate.toISOString().slice(2, 10),
//         endDate: lastDayOfYear.toISOString().slice(2, 10),
//         selectedRadio: selectedRadio,
//       };
//     } else if (selectedRadio === "day") {
//       searchData = {
//         affair: selectedAffair,
//         startDate: startDate.toISOString().slice(2, 10),
//         endDate: endDate.toISOString().slice(2, 10),
//         selectedRadio: selectedRadio,
//       };
//     }

//     try {
//       const response = fetch(back_url + 'quarterpower/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           data: searchData,
//         }),
//       });

//       const data = response.json();

//       if (data.returnCode === 'ok') {
//       const time_list = []
//       const ele_list = []

//       data.list.map((value, index) => {
//         const roundedpower = Math.round(value.power);
//         if (selectedRadio === "quarter") {
//           time_list.push(value.date.replace('T',' ').slice(5,16))
//           ele_list.push(roundedpower)
//         }
//         else if (selectedRadio === "half") {
//           time_list.push(value.date.replace('T',' ').slice(5,16))
//           ele_list.push(roundedpower)
//         }
//         else if (selectedRadio === "hour") {
//           time_list.push(value.date.replace('T',' ').slice(5,13))
//           ele_list.push(roundedpower)
//         }
//         else if (selectedRadio === "day") {
//           time_list.push(value.date.slice(0,10))
//           ele_list.push(roundedpower)
//         }
//         else if (selectedRadio === "month") {
//           time_list.push(value.date.slice(0,7))
//           ele_list.push(roundedpower)
//         }
//         else if (selectedRadio === "year") {
//           time_list.push(value.date.slice(0,4))
//           ele_list.push(roundedpower)
//         }
//       })

//       settime(time_list)
//       setkwh(ele_list)
//       console.log(data.list)
//     }
//     else {
//       // Handle the error
//       console.error(data.error);
//       Swal.fire({
//         icon: 'error',
//         title: '선택된 날짜의 데이터가 없습니다.',
//         confirmButtonText: "확인",
//       });
//     }
//   } catch (error) {
//     console.log(error.message);
//   }finally {
//     setLoading(false); // 로딩 종료
//   }
// }
// }
// else {
// if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
//   searchData = {
//     affair: selectaffair,
//     startDate: startDate.toISOString().slice(2, 10),
//     endDate: endDate.toISOString().slice(2, 10),
//     selectedRadio: selectedRadio,
//   };
// } else if (selectedRadio === "month") {
//   const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
//   lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
//   searchData = {
//     affair: selectaffair,
//     startDate: startDate.toISOString().slice(2, 10),
//     endDate: lastDayOfMonth.toISOString().slice(2, 10),
//     selectedRadio: selectedRadio,
//   };
// } else if (selectedRadio === "year") {
//   const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
//   lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
//   searchData = {
//     affair: selectaffair,
//     startDate: startDate.toISOString().slice(2, 10),
//     endDate: lastDayOfYear.toISOString().slice(2, 10),
//     selectedRadio: selectedRadio,
//   };
// } else if (selectedRadio === "day") {
//   searchData = {
//     affair: selectaffair,
//     startDate: startDate.toISOString().slice(2, 10),
//     endDate: endDate.toISOString().slice(2, 10),
//     selectedRadio: selectedRadio,
//   };
// }

// try {
//   const response = await fetch(back_url + 'quarterpower/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       data: searchData,
//     }),
//   });

//   const data = await response.json();

//   if (data.returnCode === 'ok') {
//   const time_list = []
//   const ele_list = []

//   data.list.map((value, index) => {
//     const roundedpower = Math.round(value.power);
//     if (selectedRadio === "quarter") {
//       time_list.push(value.date.replace('T',' ').slice(5,16))
//       ele_list.push(roundedpower)
//     }
//     else if (selectedRadio === "half") {
//       time_list.push(value.date.replace('T',' ').slice(5,16))
//       ele_list.push(roundedpower)
//     }
//     else if (selectedRadio === "hour") {
//       time_list.push(value.date.replace('T',' ').slice(5,13))
//       ele_list.push(roundedpower)
//     }
//     else if (selectedRadio === "day") {
//       time_list.push(value.date.slice(0,10))
//       ele_list.push(roundedpower)
//     }
//     else if (selectedRadio === "month") {
//       time_list.push(value.date.slice(0,7))
//       ele_list.push(roundedpower)
//     }
//     else if (selectedRadio === "year") {
//       time_list.push(value.date.slice(0,4))
//       ele_list.push(roundedpower)
//     }
//   })

//   settime(time_list)
//   setkwh(ele_list)
//   // console.log(ele_list)
// }
// else {
//   // Handle the error
//   console.error(data.error);
//   Swal.fire({
//     icon: 'error',
//     title: '선택된 날짜의 데이터가 없습니다.',
//     confirmButtonText: "확인",
//   });
// }
// } catch (error) {
// console.log(error.message);
// }finally {
//   setLoading(false); // 로딩 종료
// }
// }
// }