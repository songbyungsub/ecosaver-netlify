// /* eslint-disable */
// import { fontSize } from "@mui/system";
// import React, { useState, PureComponent, useEffect, forwardRef } from "react";
// import {
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
//   CFormSelect,
//   CRow,
//   CCol,
//   CContainer,
//   CFormCheck,
//   CButton,
//   CCard,
//   CCardBody,
//   CCardTitle,
// } from '@coreui/react'
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { CChartLine, CChart } from '@coreui/react-chartjs'
// import { ko } from 'date-fns/esm/locale';
// import Swal from "sweetalert2";
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import '../../assets/scss/date.css'
// // import { endOfMonth, setMonth } from 'date-fns'
// // import moment from 'moment';
// import axios from 'axios'
// import { Spinner } from 'react-bootstrap';
// import { Await } from "react-router-dom";


// const Power = () => {
// const getRandomColor = () => {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return { r, g, b };
// };

//   //date picker
//   const [startDate, setStartDate] = useState();
//   const [endDate, setEndDate] = useState();
//   const [selectedRadio, setSelectedRadio] = useState('');

//   const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
//     <button className="example-custom-input" onClick={onClick} ref={ref}>
//       {value}
//     </button>
//   ));

//   const handleRadioChange = (e) => {
//     setSelectedRadio(e.target.value);
//     //날짜 선택시 초기화
//     setStartDate(new Date());
//     setEndDate(new Date());
//   };


//   //변수
//   const [headquarter, setHeadquarter] = useState(''); //본부
//   const [affair, setaffair] = useState(''); //국사
//   const [chartaffair, setchartaffair] = useState('') //차트에 들어가는 affiar
  
//   const [selectaffair, setselectaffair] = useState('전체'); //국사초기화용
//   const [power, setpower] = useState('') //전력 총 데이터

//   const [time, settime] = useState('') //시간
//   const [kwh, setkwh] = useState('') // 전력

//   const back_url = 'http://121.131.210.83/main/'

//   //프로그래스
//   const [loading, setLoading] = useState(false);
//   const toggleLoading = (status) => {
//     setLoading(status);
//   };

//   //본부
//   useEffect(() => {
//     // toggleLoading(true);
//     const getRegion = async () => {
//       let url = back_url + 'depthheadquarter/'
//       setaffair([]);
//       try {
//         const response = await fetch(url, {
//           method: 'POST',
//         })

//         const data = await response.json()
//         if (data.returnCode === 'ok') {
//           setHeadquarter(data.list)
//         }
//         else {
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     };
//     getRegion();
//   }, [])

//   //국사
//   const handleSelectaffair = async (selectedOption) => {
//     // toggleLoading(true);
//     setaffair([]);
//     try {
//       const response = await fetch(back_url + 'depthaffair/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           data: {
//             headquarter: selectedOption,
//           },
//         }),
//       });

//       const data = await response.json();

//       if (data.returnCode === 'ok') {
//         setaffair(data.list)
//       } else {
//         // 에러 처리
//         console.error(data.error);
//       }
//     } catch (error) {
//       console.log(error.message);
//     }

//   };

//   const handleaffairdata = (e) => {
//     setselectaffair(e.target.value)
//   }

//    //조회 버튼 클릭
//    const fetchData = async (searchData) => {
//   try {
//     const response = await fetch(back_url + 'quarterpower/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         data: searchData,
//       }),
//     });

//     const data = await response.json();



//     if (data.returnCode === 'ok') {
//       // console.log(data)
//       const time_list = [];
//       const ele_list = [];
//       setchartaffair(data.list.affair);

//       data.list.data.map((value, index) => {
//         const roundedpower = Math.round(value.power);
//         if (selectedRadio === "quarter") {
//           time_list.push(value.date.replace('T',' ').slice(5,16));
//           ele_list.push(roundedpower);
//         } else if (selectedRadio === "half") {
//           time_list.push(value.date.replace('T',' ').slice(5,16));
//           ele_list.push(roundedpower);
//         } else if (selectedRadio === "hour") {
//           time_list.push(value.date.replace('T',' ').slice(5,13));
//           ele_list.push(roundedpower);
//         } else if (selectedRadio === "day") {
//           time_list.push(value.date.slice(0,10));
//           ele_list.push(roundedpower);
//         } else if (selectedRadio === "month") {
//           time_list.push(value.date.slice(0,7));
//           ele_list.push(roundedpower);
//         } else if (selectedRadio === "year") {
//           time_list.push(value.date.slice(0,4));
//           ele_list.push(roundedpower);
//         }
//       });

//       // console.log(data.list)
//       return { time_list, ele_list };
//       // console.log(ele_list
//     } else {
//       // Handle the error
//       console.error(data.error);
//       Swal.fire({
//         icon: 'error',
//         title: '선택된 날짜의 데이터가 없습니다.',
//         confirmButtonText: "확인",
//       });
//       return null;
//     }
//   } catch (error) {
//     console.log(error.message);
//     return null;
//   }
// };

// const handleSearch = async () => {
//   setLoading(true);

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

//       const result = await fetchData(searchData);

//       if (result) {
//         settime((prev) => [...prev, ...result.time_list]);
//         setkwh((prev) => [...prev, ...result.ele_list]);
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

//     const result = await fetchData(searchData);

//     if (result) {
//       settime(result.time_list);
//       setkwh(result.ele_list);
//     }
//   }

//   setLoading(false); // 로딩 종료
// };

//   return (
//     <div>
//       <CContainer fluid >
//         <CRow>
//           <CCol xs={2} style={{ width: '13rem' }}>
//             <span><b>본부</b></span>
//             <CFormSelect

//               aria-label="Default select example"
//               options={[
//                 '선택',
//                 { label: headquarter[0], value: headquarter[0] },
//                 { label: headquarter[1], value: headquarter[1] },
//                 { label: headquarter[2], value: headquarter[2] },
//                 { label: headquarter[3], value: headquarter[3] },
//                 { label: headquarter[4], value: headquarter[4] },
//                 { label: headquarter[5], value: headquarter[5] },
//                 { label: headquarter[6], value: headquarter[6] },
//                 { label: headquarter[7], value: headquarter[7] },
//                 { label: headquarter[8], value: headquarter[8] },
//               ]}
//               onChange={(e) => handleSelectaffair(e.target.value)}
//             />
//           </CCol>
//           <CCol xs={1}>
//             <span><b>국사</b></span>
//             <CFormSelect
//               // style={{ width: '8rem' }}
//               aria-label="Default select example"
//               // value={setdefaultall}/
//               options={[
//                 { label: "전체", value: '전체' },
//                 ...Array.from({ length: affair.length }, (_, index) => (
//                   { label: affair[index], value: affair[index] }
//                 )),
//               ]}
//               onChange={handleaffairdata}
//             />
//           </CCol>
//           <CCol xs={1}>
//             <span><b>기간</b></span>
//             <CFormSelect
//               aria-label="Default select example"
//               value={selectedRadio}  // 현재 선택된 값을 value로 설정
//               options={[
//                 '선택',
//                 { label: '15분', value: 'quarter' },
//                 { label: '30분', value: 'half' },
//                 { label: '1시간', value: 'hour' },
//                 { label: '일별', value: 'day' },
//                 { label: '월별', value: 'month' },
//                 { label: '년별', value: 'year' },
//               ]}
//               onChange={handleRadioChange} // 선택 시 상태 업데이트
//             >
//             </CFormSelect>
//           </CCol>


//           {selectedRadio === "quarter" ||
//             selectedRadio === "half" ||
//             selectedRadio === "hour" ? (
//             <CCol xs={4} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
//               <br></br>
//               <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 : </b></span>
//               <DatePicker
//                 customInput={<ExampleCustomInput />}
//                 locale={ko}
//                 dateFormat="yyyy년 MM월 dd일"
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 selectsStart
//                 startDate={startDate}
//                 endDate={endDate}
//               />
//               <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
//               <DatePicker
//                 customInput={<ExampleCustomInput />}
//                 locale={ko}
//                 dateFormat="yyyy년 MM월 dd일"
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 selectsEnd
//                 startDate={startDate}
//                 endDate={endDate}
//                 minDate={startDate}
//               />
//             </CCol>
//           ) : null}

//           {selectedRadio === "day" ? (
//             <>
//               <CCol xs={4} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
//                 <br></br>
//                 <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 : </b></span>
//                 <DatePicker
//                   customInput={<ExampleCustomInput />}
//                   locale={ko}
//                   dateFormat="yyyy년 MM월 dd일"
//                   selected={startDate}
//                   onChange={(date) => setStartDate(date)}
//                   selectsStart
//                   startDate={startDate}
//                   endDate={endDate}
//                 />
//                 <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
//                 <DatePicker
//                   customInput={<ExampleCustomInput />}
//                   locale={ko}
//                   dateFormat="yyyy년 MM월 dd일"
//                   selected={endDate}
//                   onChange={(date) => setEndDate(date)}
//                   selectsEnd
//                   startDate={startDate}
//                   endDate={endDate}
//                   minDate={startDate}
//                 />
//               </CCol>
//             </>
//           ) : null}

//           {selectedRadio === "month" ? (
//             <>
//               <CCol xs={3} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
//                 <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 : </b></span>
//                 <DatePicker
//                   customInput={<ExampleCustomInput />}
//                   locale={ko}
//                   dateFormat="yyyy년 MM월"
//                   selected={startDate}
//                   onChange={(date) => setStartDate(date)}
//                   selectsStart
//                   startDate={startDate}
//                   endDate={endDate}
//                   showMonthYearPicker
//                 />
//                 <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
//                 <DatePicker
//                   customInput={<ExampleCustomInput />}
//                   locale={ko}
//                   dateFormat="yyyy년 MM월"
//                   selected={endDate}
//                   onChange={(date) => setEndDate(date)}
//                   selectsEnd
//                   startDate={startDate}
//                   endDate={endDate}
//                   showMonthYearPicker
//                 />
//               </CCol>
//             </>
//           ) : null}

//           {selectedRadio === "year" ? (
//             <>
//               <CCol xs={3} style={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end' }}>
//                 <br></br>
//                 <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '7px' }}><b> 날짜 : </b></span>
//                 <DatePicker
//                   customInput={<ExampleCustomInput />}
//                   selected={startDate}
//                   onChange={(date) => setStartDate(date)}
//                   selectsStart
//                   startDate={startDate}
//                   endDate={endDate}
//                   dateFormat="yyyy년"
//                   showYearPicker
//                 />
//                 <span style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '5px' }}><b>부터</b></span>
//                 <DatePicker
//                   customInput={<ExampleCustomInput />}
//                   selected={endDate}
//                   onChange={(date) => setEndDate(date)}
//                   selectsEnd
//                   startDate={startDate}
//                   endDate={endDate}
//                   dateFormat="yyyy년"
//                   showYearPicker
//                 />
//               </CCol>
//             </>
//           ) : null}

//           <CCol xs={2}>
//             <br></br>
//             <CButton onClick={handleSearch} color="success" variant="outline">전력량 조회</CButton>
//           </CCol>
//           <CCol xs={2}>
//             <br></br>
//             <CButton color="success" variant="outline">전력비 조회</CButton>
//           </CCol>
//         </CRow>

//         <br></br><br></br>
//         <CRow>
//         <CCard style={{ width: '100rem', height: '45rem', position: 'relative' }}>
//         {loading && ( // 로딩 중일 때만 spinner 표시
//           <div
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               width: '100%',
//               height: '100%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               background: 'rgba(255, 255, 255, 0.8)',
//             }}
//           >
//             <Spinner animation="border" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//           </div>
//         )}
//         <CCardBody style={{ width: '100%', height: '100%' }}>
//           <CCardTitle><b>전력 사용량</b></CCardTitle>
//           <div style={{ width: '100%', height: '42rem' }}>
//             <CChart
//               style={{ width: '100%', height: '100%', maxHeight: '100%' }}
//               type="line"
//               data={{
//                 labels: time,
//                 datasets: selectaffair === '전체'
//                 ? (Array.isArray(kwh)
//                     ? affair.map((selectedAffair, index) => {
//                         const uniqueColor = getRandomColor(); // Generate a unique color
//                         return {
//                           label: selectedAffair,
//                           backgroundColor: `rgba(${uniqueColor.r}, ${uniqueColor.g}, ${uniqueColor.b}, 0.2)`,
//                           borderColor: `rgba(${uniqueColor.r}, ${uniqueColor.g}, ${uniqueColor.b}, 1)`,
//                           pointBackgroundColor: "white",
//                           pointBorderColor: "black",
//                           pointRadius: 3,
//                           data: kwh.filter((_, i) => selectaffair === '전체' || selectaffair === affair[i]),
//                         };
//                       })
//                     : [])
//                 : [
//                     {
//                       label: chartaffair,
//                       backgroundColor: "rgba(151, 187, 205, 0.2)",
//                       borderColor: "rgba(151, 187, 205, 1)",
//                       pointBackgroundColor: "white",
//                       pointBorderColor: "black",
//                       pointRadius: 3,
//                       data: Array.isArray(kwh) ? kwh : [], // Ensure kwh is treated as an array
//                     },
//                   ],
//               }}
//               options={{
//                 plugins: {
//                   legend: {
//                     labels: {},
//                   },
//                   tooltip: {
//                     callbacks: {
//                       label: (context) => {
//                         const datasetLabel = context.dataset.label || '';
//                         const value = context.parsed.y.toLocaleString('en-AU') + ' kW/h';
//                         return datasetLabel + ': ' + value;
//                       },
//                     },
//                   },
//                 },
//                 scales: {
//                   x: {
//                     grid: {},
//                     ticks: {},
//                   },
//                   y: {
//                     grid: {},
//                     ticks: {
//                       callback: (value) => Math.round(value).toLocaleString('en-AU') + ' kW/h',
//                     },
//                   },
//                 },
//               }}
//             />
//           </div>
//         </CCardBody>
//       </CCard>

//         </CRow>
//       </CContainer>
      
//     </div>
//   );
// };

// export default Power;




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