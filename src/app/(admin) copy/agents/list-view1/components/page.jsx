import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardHeader, Col, Row } from 'react-bootstrap';
import LeadList from '@/app/(admin)/leads/list/components/LeadList';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ListViewPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState(0);

  return (
    <>
      <PageTitle title="Tenants List" />

      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader className="border-0">
              <Row className="justify-content-between">
                <Col lg={6}>
                  <Row className="align-items-center">
                    <Col lg={6}>
                      <form className="app-search d-none d-md-block me-auto" onSubmit={(e) => e.preventDefault()}>
                        <div className="position-relative">
                          <input
                            type="search"
                            className="form-control"
                            placeholder="Search Tenants"
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <IconifyIcon
                            icon="solar:magnifer-broken"
                            className="search-widget-icon"
                          />
                        </div>
                      </form>
                    </Col>

                    <Col lg={4}>
                      <h5 className="text-dark fw-medium mb-0">
                        Tenants
                        <span className="text-muted"> ({count})</span>
                      </h5>
                    </Col>
                  </Row>
                </Col>

                <Col lg={6}>
                  <div className="text-md-end mt-3 mt-md-0">
                    {/* <button
                      type="button"
                      className="btn btn-outline-primary me-2"
                      style={{
                        '--bs-btn-hover-bg': '#5D7186',
                        '--bs-btn-hover-border-color': '#5D7186',
                        '--bs-btn-hover-color': '#fff',
                        minWidth: '150px',
                      }}
                    >
                      <IconifyIcon
                        icon="ri:filter-line"
                        className="me-1"
                      />
                      Filters
                    </button> */}

                    <button
                      type="button"
                      className="btn btn-outline-primary me-2"
                      onClick={() => navigate('/add leads')} 
                      style={{
                        '--bs-btn-hover-bg': '#5D7186',
                        '--bs-btn-hover-border-color': '#5D7186',
                        '--bs-btn-hover-color': '#fff',
                        minWidth: '150px',
                      }}
                    >
                      <IconifyIcon
                        icon="ri:add-line"
                        className="me-1"
                      />
                      New Tenant
                    </button>
                  </div>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>

      <LeadList 
        purposeFilter="tenant" 
        searchQuery={searchQuery}
        onCountChange={setCount}
      />
    </>
  );
};

export default ListViewPage;