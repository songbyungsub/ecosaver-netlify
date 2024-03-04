/* eslint-disable */
import { fontSize } from "@mui/system";
import React, { useState, PureComponent,useEffect,forwardRef } from "react";
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
import '../../assets/scss/date.css'
import Swal from "sweetalert2";

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Cost = () => {
  // const back_url = 'http://127.0.0.1:8000/main/'
  const back_url = 'http://121.131.210.83:8001/main/'


  //date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRadio, setSelectedRadio] = useState(null);

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


    //변수
    const [headquarter, setHeadquarter] = useState(''); //본부
    const [center, setcenter] = useState(''); //센터
    const [selectcenter, setselectcenter] = useState(''); //센터초기화용
    const [team, setteam] = useState(''); //팀
    const [affair, setaffair] = useState(''); //국사
    const [selectaffair, setselectaffair] = useState(''); //국사초기화용
    const [power, setpower] = useState('') //전력데이터

    const[time,settime] = useState('') //시간
    const[cost,setcost] = useState('') // 전력
    console.log('tes')

  //본부
  useEffect(() => {
    const getRegion = async () => {
      let url = back_url + 'depthheadquarter/'
      setcenter([])
      setteam([]);
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

  //센터
  // const handleSelectcenter = async (selectedOption) => {
  //   console.log(selectedOption)

  //   setcenter([])
  //   setteam([]);
  //   setaffair([]);

  //   try {
  //     const response = await fetch(back_url + 'depthcenter/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         data: {
  //           headquarter: selectedOption,
  //         },
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.returnCode === 'ok') {
  //       setcenter(data.list)
  //       console.log(center)
  //     } else {
  //       // 에러 처리
  //       console.error(data.error);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };


  // //팀
  // const handleSelectteam = async (selectedOption) => {
  //   console.log(selectedOption)
  //   setselectcenter(selectedOption)
  //   setteam([]);
  //   setaffair([]);

  //   try {
  //     const response = await fetch(back_url + 'depthteam/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         data: {
  //           center: selectedOption,
  //         },
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.returnCode === 'ok') {
  //       setteam(data.list)
  //     } else {
  //       // 에러 처리
  //       console.error(data.error);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  //국사
  const handleSelectaffair = async (selectedOption) => {
    setaffair([]);
    // console.log(selectedOption)
    try {
      const response = await fetch(back_url + 'depthaffair/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            headquarter: selectedOption,
            // center: selectcenter,
          },
        }),
      });

      const data = await response.json();

      if (data.returnCode === 'ok') {
        // console.log(data.list)
        setaffair(data.list)
      } else {
        // 에러 처리
        console.error(data.error);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleaffairdata = (e) => {
    setselectaffair(e.target.value)
  }

  //조회 버튼 클릭
  const handleSearch = async () => {
    var searchData = {}
    if (selectedRadio === "quarter" || selectedRadio === "half" || selectedRadio === "hour") {
      
      searchData = {
        // center: selectcenter,
        affair: selectaffair,
        startDate: startDate.toISOString().slice(2, 10),
        endDate: startDate.toISOString().slice(2, 10),
        selectedRadio: selectedRadio,
      };
    } else if (selectedRadio === "month") {
      // "월별" 선택 시 endDate를 선택한 월의 마지막 날짜로 설정
      const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
      lastDayOfMonth.setDate(lastDayOfMonth.getDate() + 1);
      searchData = {
        // center: selectcenter,
        affair: selectaffair,
        startDate: startDate.toISOString().slice(2, 10),
        endDate: lastDayOfMonth.toISOString().slice(2, 10),
        selectedRadio: selectedRadio,
      };
    } else if (selectedRadio === "year") {
      // "년별" 선택 시 endDate를 선택한 년의 마지막 날짜로 설정
      const lastDayOfYear = new Date(endDate.getFullYear() + 1, 0, 0);
      lastDayOfYear.setDate(lastDayOfYear.getDate() + 1);
      searchData = {
        // center: selectcenter,
        affair: selectaffair,
        startDate: startDate.toISOString().slice(2, 10),
        endDate: lastDayOfYear.toISOString().slice(2, 10),
        selectedRadio: selectedRadio,
      };
    } else if (selectedRadio === "day") {
      
      searchData = {
        // center: selectcenter,
        affair: selectaffair,
        startDate: startDate.toISOString().slice(2, 10),
        endDate: endDate.toISOString().slice(2, 10),
        selectedRadio: selectedRadio,
      };
    }
    // console.log(searchData)

    try {
      const response = await fetch(back_url + 'quarterpower/', {
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
        const time_list = []
        const ele_list = []
        // console.log(data.list)
        data.list.map((value, index) => {
          // console.log(value.time)
          // console.log(index)
          if (selectedRadio === "quarter") {
            time_list.push(value.time.slice(11,16))
            ele_list.push(value.cost.toLocaleString('en-AU'))
          }
          else if (selectedRadio === "half") {
            time_list.push(value.time.slice(11,16))
            ele_list.push(value.cost.toLocaleString('en-AU'))
          }
          else if (selectedRadio === "hour") {
            time_list.push(value.time.slice(11,13))
            ele_list.push(value.cost.toLocaleString('en-AU'))
          }
          else if (selectedRadio === "day") {
            time_list.push(value.time.slice(5,11))
            ele_list.push(value.cost.toLocaleString('en-AU'))
          }
          else if (selectedRadio === "month") {
            time_list.push(value.time.slice(0,7))
            ele_list.push(value.cost.toLocaleString('en-AU'))
          }
          else if (selectedRadio === "year") {
            time_list.push(value.time.slice(0,4))
            ele_list.push(value.cost.toLocaleString('en-AU'))
          }
          
          // console.log(data.list)
        })
        
        settime(time_list)
        setcost(ele_list)
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
  };

  return (
    <div>
      {/* <h2 class="display-8"><b>전력비 청구 현황</b></h2>
      <p class="lead">본부-센터-팀-국사순으로 선택가능합니다.</p>
      <hr style={{ border: "solid 2px" }}></hr> */}

<CContainer fluid >
        <CRow>
        <CCol xs={2} style={{ width: '13rem' }}>
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
          {/* <CCol xs={2}>
            <span><b>센터</b></span>
            <CFormSelect
              // style={{ width: '100px' }}
              aria-label="Default select example"
              options={[
                '선택',
                ...Array.from({ length: center.length }, (_, index) => (
                  { label: center[index], value: center[index] }
                )),
              ]}
              onChange={(e) => handleSelectteam(e.target.value)}
            />
          </CCol>
          
           <CCol xs={2} style={{ width: '13rem' }}>
            <span><b>팀</b></span>
            <CFormSelect
              // style={{ width: '10rem' }}
              aria-label="Default select example"
              options={[
                '선택',
                ...Array.from({ length: team.length }, (_, index) => (
                  { label: team[index], value: team[index] }
                )),
              ]}
              onChange={(e) => handleSelectaffair(e.target.value)}
            />
          </CCol> */}
          <CCol xs={1}>
            <span><b>국사</b></span>
            <CFormSelect
              // style={{ width: '8rem' }}
              aria-label="Default select example"
              options={[
                '선택',
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
              // style={{ width: '8rem' }}
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
              {/* <option value="quarter">15분</option>
              <option value="half">30분</option>
              <option value="hour">1시간</option>
              <option value="day">일별</option>
              <option value="month">월별</option>
              <option value="year">년별</option> */}
            </CFormSelect>
          </CCol>

         
          {selectedRadio === "quarter" ||
            selectedRadio === "half" ||
            selectedRadio === "hour" ? (
              <CCol >
              <br></br>
              <span style={{ marginLeft: '10px',marginRight: '10px' }}><b> 날짜 : </b></span>
              <DatePicker
                // className={styles.datePicker}
                customInput={<ExampleCustomInput />}
                // showIcon
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </CCol>
          ) : null}

          {selectedRadio === "day" ? (
            <>
            {/* <CRow> */}
            <CCol xs={4} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
              <br></br>
              <span style={{ marginLeft: '10px', marginRight: '10px' , marginBottom:'7px'}}><b> 날짜 : </b></span>
              
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
                <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
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
            {/* </CRow> */}
            </>
          ) : null}

          {selectedRadio === "month" ? (
            <>
              <CCol xs={3} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ marginLeft: '10px', marginRight: '10px' , marginBottom:'7px'}}><b> 날짜 : </b></span>
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
                <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
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
                <CCol xs={3} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
                <br></br>
                <span style={{ marginLeft: '10px', marginRight: '10px' , marginBottom:'7px'}}><b> 날짜 : </b></span>
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
                <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
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


          
          <CCol>
          <br></br>
            <CButton onClick={handleSearch} color="success" variant="outline">조회</CButton>
          </CCol>
        </CRow>


        <br></br><br></br>
        <CRow>
        <CCard style={{ width: '100rem', height: '45rem' }}>
  <CCardBody style={{ width: '100%', height: '100%' }}>
    <CCardTitle><b>전력 사용량</b></CCardTitle>
    <div style={{ width: '100%', height: '42rem' }}>
      <CChart
        style={{ width: '100%', height: '100%', maxHeight: '100%' }}
        type="line"
        data={{
                  labels: time,
                  datasets: [
                    // {
                    //   label: "22년 전력비용",
                    //   backgroundColor: "rgba(220, 220, 220, 0.2)",
                    //   borderColor: "rgba(220, 220, 220, 1)",
                    //   pointBackgroundColor: "rgba(220, 220, 220, 1)",
                    //   pointBorderColor: "#fff",
                    //   data: [40, 20, 12, 39, 10, 40, 39, 80, 40]
                    // },
                    {
                      label: "전력비용",
                      backgroundColor: "rgba(151, 187, 205, 0.2)",
                      borderColor: "rgba(151, 187, 205, 1)",
                      pointBackgroundColor: "rgba(151, 187, 205, 1)",
                      pointBorderColor: "#fff",
                      data: cost
                    },
                  ],
                }}
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
                          const value = context.parsed.y.toLocaleString('en-AU') + ' 원';
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
                        callback: (value) => value.toLocaleString('en-AU') + '원', // 
                      },
                    },
                  },
                }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CRow>
      </CContainer>







    </div>
  );
};

export default Cost;


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