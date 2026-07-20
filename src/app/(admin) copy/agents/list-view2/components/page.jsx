import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardHeader, Col, Row } from 'react-bootstrap';
import LeadList from '@/app/(admin)/leads/list/components/LeadList';
import { useState } from 'react';

const ListViewPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [count, setCount] = useState(0);

  return (
    <>
      <PageTitle title="Landlord List" />
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
                            placeholder="Search Landlord"
                            autoComplete="off"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <IconifyIcon icon="solar:magnifer-broken" className="search-widget-icon" />
                        </div>
                      </form>
                    </Col>
                    <Col lg={4}>
                      <h5 className="text-dark fw-medium mb-0">
                        Landlords <span className="text-muted">({count})</span>
                      </h5>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Col>
      </Row>
      <LeadList 
        purposeFilter="landlord" 
        searchQuery={searchQuery}
        onCountChange={setCount}
      />
    </>
  );
};

export default ListViewPage;