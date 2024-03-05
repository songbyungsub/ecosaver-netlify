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
  CCardSubtitle,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
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
import { Chart } from 'chart.js'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import { colourOptions } from '../data';
import { Await } from "react-router-dom";
import "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'react-chartjs-2';
// import DataTable from 'datatables.net-dt'
// import $ from 'jquery';
// import './dataTables.jqueryui.min.css'
import Table from 'react-bootstrap/Table';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import './datatabledemo.css'
// import 'primeicons/primeicons.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.css';
// import 'primeflex/primeflex.css';

const animatedComponents = makeAnimated();



const Power = () => {


  //date picker
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRadio, setSelectedRadio] = useState('');

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));

  //프로그래스
  const [loading, setLoading] = useState(false);
  const toggleLoading = (status) => {
    setLoading(status);
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

  const [table_list, settable_list] = useState('') //시간
  const [kwh, setkwh] = useState('') // 전력
  const [unit, setunit] = useState('') // x축 라벨


  const back_url = 'http://127.0.0.1/main/'

  // console.log(startDate.toISOString().slice(2, 10))


  function down_daily_power() {
    axios(
      {
        url: back_url + "export_affair_power/",
        method: "post",
        responseType: 'blob',
      }
    ).then((response) => {
      // console.log(response)
      const href = window.URL.createObjectURL(response.data);

      const anchorElement = document.createElement('a');

      anchorElement.href = href;
      anchorElement.download = "강북강원국사별전력데이터.csv";

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    }).catch((xhr) => {
      // console.log(xhr)
    })
  }



  function down_daily_report() {

    axios(
      {
        url: back_url + "export_daily_report_data/",
        method: "post",
        responseType: 'blob',
        data: {
          startDate: startDate.toISOString().slice(2, 10),
        }
      }
    ).then((response) => {
      // console.log(response)

      if (response.data.size === 42) {
        Swal.fire({
          icon: 'error',
          title: '선택된 날짜의 데이터가 없습니다.',
          confirmButtonText: "확인",
        });
        return;
      }
      const href = window.URL.createObjectURL(response.data);

      const anchorElement = document.createElement('a');

      anchorElement.href = href;
      anchorElement.download = startDate.toISOString().slice(2, 10).replace(/\-/g, '') + "_강북강원 전력량 일일 리포트.csv";

      document.body.appendChild(anchorElement);
      anchorElement.click();

      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(href);
    }).catch((xhr) => {
      // console.log(xhr)
    })
  }



  const [center_name, setcenter_name] = useState([])
  const [value1, setvalue1] = useState([])
  const [value2, setvalue2] = useState([])
  const [value3, setvalue3] = useState([])
  const [value4, setvalue4] = useState([])
  const [value5, setvalue5] = useState([])
  const [value6, setvalue6] = useState([])
  const [value7, setvalue7] = useState([])
  const [value8, setvalue8] = useState([])
  const [value9, setvalue9] = useState([])

  const [col1, setcol1] = useState('')
  const [col2, setcol2] = useState('')
  const [col3, setcol3] = useState('')
  const [col4, setcol4] = useState('')
  const [col5, setcol5] = useState('')
  const [col6, setcol6] = useState('')
  const [col7, setcol7] = useState('')
  const [col8, setcol8] = useState('')
  const [col9, setcol9] = useState('')

  useEffect(() => {

    // Fetch data and update DataTable
    const fetchData = async () => {
      setLoading(true); // 로딩 시작
      let url = back_url + 'power_goal_dashboard/'

      try {
        // Fetch your data here (use your actual endpoint)
        const response = await fetch(url, {
          method: 'POST',
        })
        const jsonData = await response.json();
        // Find and extract the '센터' data
        const centerDataArray = jsonData.data.map(item => item['센터']);
        setcenter_name(centerDataArray);



        if (jsonData.data.length > 0) {
          const key1 = Object.keys(jsonData.data[0])[1];
          const key2 = Object.keys(jsonData.data[0])[2];
          const key3 = Object.keys(jsonData.data[0])[3];
          const key4 = Object.keys(jsonData.data[0])[4];
          const key5 = Object.keys(jsonData.data[0])[5];
          const key6 = Object.keys(jsonData.data[0])[6];
          const key7 = Object.keys(jsonData.data[0])[7];
          const key8 = Object.keys(jsonData.data[0])[8];
          const key9 = Object.keys(jsonData.data[0])[9];

          const valuesForValue1 = jsonData.data.map(item => item[key1]);
          const valuesForValue2 = jsonData.data.map(item => item[key2]);
          const valuesForValue3 = jsonData.data.map(item => item[key3]);
          const valuesForValue4 = jsonData.data.map(item => item[key4]);
          const valuesForValue5 = jsonData.data.map(item => item[key5]);
          const valuesForValue6 = jsonData.data.map(item => item[key6]);
          const valuesForValue7 = jsonData.data.map(item => item[key7]);
          const valuesForValue8 = jsonData.data.map(item => item[key8]);
          const valuesForValue9 = jsonData.data.map(item => item[key9]);

          setcol1(key1);
          setcol2(key2);
          setcol3(key3);
          setcol4(key4);
          setcol5(key5);
          setcol6(key6);
          setcol7(key7);
          setcol8(key8);
          setcol9(key9);

          setvalue1(valuesForValue1);
          setvalue2(valuesForValue2);
          setvalue3(valuesForValue3);
          setvalue4(valuesForValue4);
          setvalue5(valuesForValue5);
          setvalue6(valuesForValue6);
          setvalue7(valuesForValue7);
          setvalue8(valuesForValue8);
          setvalue9(valuesForValue9);
        }


      } catch (error) {
        // console.error('Error fetching or updating data:', error);
      } finally {
        setLoading(false); // 로딩 종료
      }

    };

    // Call the fetchData function to populate DataTable
    fetchData();
  }, []);



  // console.log(llist)
  // console.log(value1)

  return (
    <div>
      <CContainer fluid >
        <CRow>
          <CCol xs={9}>
            <CCard>
              {loading && (
                <div
                  style={{
                    position: 'absolute',
                    top: '55%',  // 중앙 정렬을 위해 50%로 설정
                    left: '50%',  // 중앙 정렬을 위해 50%로 설정
                    transform: 'translate(-50%, -50%)',  // 중앙 정렬을 위한 변환
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 1,
                  }}
                >
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                  <div style={{ marginTop: '10px' }}>로딩 중...</div>
                </div>
              )}
              <CCardBody >
                <CCardTitle><b>센터별 전년/목표대비 증감율 및 달성률</b></CCardTitle>
                {/* <br></br> */}
                {/* <CRow>
                  <CCol>
                    <div style={{ marginTop: '10px', marginLeft: '10px' }}>
                      <span>※선택된 날짜의 전날까지의 누계 데이터가 제공됩니다.</span>
                    </div>
                  </CCol>
                  <CCol style={{ marginLeft: '30 px', display: 'flex', alignItems: 'flex-end' }}>
                    <br></br>
                    <span style={{ marginRight: '10px', marginBottom: '7px' }}><b> 날짜 : </b></span>
                    <DatePicker
                      customInput={<ExampleCustomInput />}
                      locale={ko}
                      dateFormat="yyyy년 MM월 dd일"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      startDate={startDate}
                    />
                    <CButton style={{ fontSize: '17px', marginLeft: '40px ' }} color="success" onClick={down_daily_report} variant="outline">리포트 다운로드</CButton>
                  </CCol>
                </CRow> */}
                <br></br><br></br>
                <h5><b>[1일 누계]</b></h5>
                <CRow>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Table bordered className="text-center">
                      <thead className="align-middle">
                        <tr className="table-secondary" >
                          <th colSpan={3}>구분</th>
                          <th>{center_name[4]}</th>
                          <th>코어</th>
                          <th>서울강북</th>
                          <th>강원</th>
                          <th >경기북부</th>
                        </tr>
                      </thead>
                      <tbody className="align-middle">
                        {/* 계 */}
                        <tr>
                          <td colSpan={2} rowSpan={2} >전년대비<br></br>(증감율)</td>
                          <td>누계</td>

                          <td>{value1[4]}%</td>
                          <td>{value1[3]}%</td>
                          <td>{value1[2]}%</td>
                          <td>{value1[1]}%</td>
                          <td>{value1[0]}%</td>
                        </tr>
                        <tr>

                          <td>{col2}</td>
                          <td>{value2[4]}%</td>
                          <td>{value2[3]}%</td>
                          <td>{value2[2]}%</td>
                          <td>{value2[1]}%</td>
                          <td>{value2[0]}%</td>
                        </tr>
                        <tr>
                          <td rowSpan={4}>목표대비<br></br>(달성률)</td>
                          <td rowSpan={2}>본부<br></br>(전년대비)</td>
                          <td>누계</td>

                          <td>{value4[4]}%</td>
                          <td>{value4[3]}%</td>
                          <td>{value4[2]}%</td>
                          <td>{value4[1]}%</td>
                          <td>{value4[0]}%</td>
                        </tr>
                        <tr>
                          <td>{col5}</td>

                          <td>{value5[4]}%</td>
                          <td>{value5[3]}%</td>
                          <td>{value5[2]}%</td>
                          <td>{value5[1]}%</td>
                          <td>{value5[0]}%</td>
                        </tr>
                        <tr>
                          <td rowSpan={2}>부문<br></br>(전년대비)</td>
                          <td>누계</td>

                          <td>{value7[4]}%</td>
                          <td>{value7[3]}%</td>
                          <td>{value7[2]}%</td>
                          <td>{value7[1]}%</td>
                          <td>{value7[0]}%</td>
                        </tr>
                        <tr>
                          <td>{col8}</td>

                          <td>{value8[4]}%</td>
                          <td>{value8[3]}%</td>
                          <td>{value8[2]}%</td>
                          <td>{value8[1]}%</td>
                          <td>{value8[0]}%</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CRow>

                <br></br>
                <h5><b>[최근 7일 누계]</b></h5>
                <CRow>
                <div style={{ width: '100%', textAlign: 'center' }}>
                    <Table bordered className="text-center">
                      <thead className="align-middle">
                        <tr className="table-secondary" >
                          <th bgcolor="black" colSpan={3} >구분</th>
                          <th bgcolor="#d3d3d3" >{center_name[4]}</th>
                          <th bgcolor="#d3d3d3" >코어</th>
                          <th bgcolor="#d3d3d3" >서울강북</th>
                          <th bgcolor="#d3d3d3" >강원</th>
                          <th bgcolor="#d3d3d3" >경기북부</th>
                        </tr>
                      </thead>
                      <tbody className="align-middle">
                        {/* 계 */}
                        <tr>
                          <td colSpan={2} rowSpan={2} >전년대비<br></br>(증감율)</td>
                          <td>누계</td>

                          <td>{value1[4]}%</td>
                          <td>{value1[3]}%</td>
                          <td>{value1[2]}%</td>
                          <td>{value1[1]}%</td>
                          <td>{value1[0]}%</td>
                        </tr>
                        <tr>

                          <td>{col3}</td>
                          <td>{value3[4]}%</td>
                          <td>{value3[3]}%</td>
                          <td>{value3[2]}%</td>
                          <td>{value3[1]}%</td>
                          <td>{value3[0]}%</td>
                        </tr>
                        <tr>
                          <td rowSpan={4}>목표대비<br></br>(달성률)</td>
                          <td rowSpan={2}>본부<br></br>(전년대비)</td>
                          <td>누계</td>

                          <td>{value4[4]}%</td>
                          <td>{value4[3]}%</td>
                          <td>{value4[2]}%</td>
                          <td>{value4[1]}%</td>
                          <td>{value4[0]}%</td>
                        </tr>
                        <tr>
                          <td>{col6}</td>

                          <td>{value6[4]}%</td>
                          <td>{value6[3]}%</td>
                          <td>{value6[2]}%</td>
                          <td>{value6[1]}%</td>
                          <td>{value6[0]}%</td>
                        </tr>
                        <tr>
                          <td rowSpan={2}>부문<br></br>(전년대비)</td>
                          <td>누계</td>

                          <td>{value7[4]}%</td>
                          <td>{value7[3]}%</td>
                          <td>{value7[2]}%</td>
                          <td>{value7[1]}%</td>
                          <td>{value7[0]}%</td>
                        </tr>
                        <tr>
                          <td>{col9}</td>

                          <td>{value9[4]}%</td>
                          <td>{value9[3]}%</td>
                          <td>{value9[2]}%</td>
                          <td>{value9[1]}%</td>
                          <td>{value9[0]}%</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs={3}>
            <CRow>
              <CCard style={{ height: '26rem', position: 'relative' }}>
                <CCardBody style={{ width: '100%', height: '100%' }}>
                  <CCardTitle><b>전력량 일일 리포트</b></CCardTitle>
                  <br></br>
                  <CRow>
                    <div style={{ marginTop: '10px' }}>
                      <span>※선택된 날짜의 전날까지의 누계 데이터가 제공됩니다.</span>
                    </div>
                  </CRow>
                  <br></br><br></br>
                    <span style={{ marginRight: '20px' }}><b> 날짜 선택: </b></span>
                    <DatePicker
                      customInput={<ExampleCustomInput />}
                      locale={ko}
                      dateFormat="yyyy년 MM월 dd일"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      startDate={startDate}
                    />
                    <br></br><br></br><br></br><br></br>
                    <CButton size="lg" style={{marginLeft:'105px', fontSize: '17px' }} color="success" onClick={down_daily_report} variant="outline">리포트 다운로드</CButton>
                </CCardBody>
              </CCard>
            </CRow>
            <CRow>
              <CCard style={{ height: '21.9rem', position: 'relative' }}>
                <CCardBody style={{ width: '100%', height: '100%' }}>
                  <CCardTitle><b>일일보고서 전력 데이터</b></CCardTitle>
                  <br></br>
                  <CRow>
                    <div style={{ marginTop: '10px', marginLeft: '' }}>
                      <span> ※최근 일주일의 데이터가 다운로드됩니다.</span>
                    </div>
                  </CRow>
                  <br></br><br></br><br></br>
                  <CRow style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <CButton style={{ fontSize: '17px', width: '50%', marginLeft: '90px' }} color="success" variant="outline" onClick={down_daily_power}>데이터<br></br> 다운로드</CButton>
                  </CRow>
                </CCardBody>
              </CCard>
            </CRow>
          </CCol>

        </CRow>
      </CContainer>

    </div>
  );
};

export default Power;