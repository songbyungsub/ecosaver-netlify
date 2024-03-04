/* eslint-disable */
import { Col, Row, Card, CardBody, CardTitle, CardSubtitle, Table} from "reactstrap";
import SalesChart from "../../components/dashboard/SalesChart";
import Feeds from "../../components/dashboard/Feeds";
import ProjectTables from "../../components/dashboard/ProjectTable";
import Ecochart from "../../components/dashboard/ecochart"
import Ecochart2 from "../../components/dashboard/ecochart2";
import Ecochart3 from "../../components/dashboard/ecochart3";
import Ecochart4 from "../../components/dashboard/ecochart4";
import Ecochart5 from "../../components/dashboard/ecochart5";
import Ecochart6 from "../../components/dashboard/ecochart6";
import Ecochart7 from "../../components/dashboard/ecochart7";
import Ecochart8 from "../../components/dashboard/ecochart8";
import { Container } from "reactstrap";


const Dashboard = () => {
  return (
    <div>
      <Container fluid>
      <Row>
        <Col sm="6" lg="6" xl="7" xxl="8">
          <SalesChart />
        </Col>
        <Col sm="6" lg="6" xl="5" xxl="4">
          <Feeds />
        </Col>
      </Row>
      <Row>
        {/* <Col lg="12">
          <ProjectTables />
        </Col> */}
      </Row>
      <Row>
        {/* <Col lg="12">
        <Card>
        <CardBody>
          <CardTitle tag="h5">라인 차트</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart/>
        </CardBody>
      </Card>
        </Col> */}

        <Col sm="6" lg="6" xl="7" xxl="6">
        <Card>
        <CardBody>
          <CardTitle tag="h5">라인 차트</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            상반기 전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart/>
        </CardBody>
      </Card>
        </Col>
        
        <Col sm="6" lg="6" xl="7" xxl="6">
        <Card>
        <CardBody>
          <CardTitle tag="h5">바 차트</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart2/>
        </CardBody>
      </Card>
        </Col>

        <Col sm="6" lg="6" xl="7" xxl="6">
        <Card>
        <CardBody>
          <CardTitle tag="h5">이중 라인 차트</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart3/>
        </CardBody>
      </Card>
        </Col>

        <Col sm="6" lg="7" xl="7" xxl="6">
        <Card>
        <CardBody>
          <CardTitle tag="h5">산점도</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart4/>
        </CardBody>
      </Card>
        </Col>

        <Col sm="6" lg="7" xl="7" xxl="6">
        <Card>
        <CardBody>
          <CardTitle tag="h5">산점도</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart5/>
        </CardBody>
      </Card>
        </Col>

        <Col sm="6" lg="7" xl="7" xxl="6">
        <Card>
        <CardBody>
          <CardTitle tag="h5">산점도</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart6/>
        </CardBody>
      </Card>
        </Col>

        <Col sm="6" lg="4">
        <Card>
        <CardBody>
          <CardTitle tag="h5">산점도</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart7/>
        </CardBody>
      </Card>
        </Col>

        <Col sm="6" lg="8">
        <Card>
        <CardBody>
          <CardTitle tag="h5">산점도</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            전력량 분석
          </CardSubtitle>
          <br></br>
            <Ecochart8/>
        </CardBody>
      </Card>
        </Col>

      </Row>
      </Container>
    </div>
  );
};

export default Dashboard;