import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { salesFunnelOptions } from '../data';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
const OccupancyOverview = () => {
  return <Col lg={6}>
      <Card className="border-0 shadow-sm overflow-hidden" style={{
        borderRadius: 5,
        minHeight: 354
      }}>
        <CardHeader className="d-flex justify-content-between align-items-center border-0 bg-white" style={{
          padding: '16px 20px 0'
        }}>
          <CardTitle as={'h4'} className="mb-0" style={{
            color: '#536b86',
            fontSize: 16,
            fontWeight: 600
          }}>Occupancy Overview</CardTitle>
          <Dropdown>
            <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light content-none icons-center" style={{
              borderRadius: 5,
              color: '#2f3848',
              padding: '8px 12px'
            }} data-bs-toggle="dropdown" aria-expanded="false">
              This Month <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem>Today</DropdownItem>
              <DropdownItem>Month</DropdownItem>
              <DropdownItem>Years</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>
        <CardBody style={{
          padding: '14px 0 0'
        }}>
          <div>
            <ReactApexChart options={salesFunnelOptions} series={salesFunnelOptions.series} height={225} type="line" className="apex-charts" />
          </div>
        </CardBody>
        <CardFooter className="p-0 border-top bg-white">
          <div>
            <Row className="text-center g-0">
              <Col lg={3} xs={3} className="border-end" style={{ padding: '8px 4px 9px' }}>
                <p className="mb-1" style={{ color: '#647c99', fontSize: 14 }}>Occupied</p>
                <p className="text-dark fw-medium mb-0" style={{ fontSize: 16 }}>87%</p>
              </Col>
              <Col lg={3} xs={3} className="border-end" style={{ padding: '8px 4px 9px' }}>
                <p className="mb-1" style={{ color: '#647c99', fontSize: 14 }}>Vacant</p>
                <p className="text-dark fw-medium mb-0" style={{ fontSize: 16 }}>12%</p>
              </Col>
              <Col lg={3} xs={3} className="border-end" style={{ padding: '8px 4px 9px' }}>
                <p className="mb-1" style={{ color: '#647c99', fontSize: 14 }}>Ready for Rent</p>
                <p className="text-dark fw-medium mb-0" style={{ fontSize: 16 }}>12</p>
              </Col>
              <Col lg={3} xs={3} style={{ padding: '8px 4px 9px' }}>
                <p className="mb-1" style={{ color: '#647c99', fontSize: 14 }}>Under Maintenance</p>
                <p className="text-dark fw-medium mb-0" style={{ fontSize: 16 }}>54</p>
              </Col>
            </Row>
          </div>
        </CardFooter>
      </Card>
    </Col>;
};
export default OccupancyOverview;
