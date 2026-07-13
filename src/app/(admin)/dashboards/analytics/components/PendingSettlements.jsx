import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';

const PendingSettlements = () => {
  const settlements = [
    { name: 'Sara Khan', property: 'Ocean Apartment - Unit A-301', amount: '1250 OMR' },
    { name: 'Daniyal Shaikh', property: 'Ocean Apartment - Unit A-302', amount: '1250 OMR' },
    { name: 'Kashif Khan', property: 'Ocean Apartment - Unit A-303', amount: '1250 OMR' },
    { name: 'Zeeshan Shaikh', property: 'Ocean Apartment - Unit A-304', amount: '1250 OMR' },
    { name: 'Abrar Khan', property: 'Ocean Apartment - Unit A-305', amount: '1250 OMR' }
  ];

  return (
    <Col xl={4} lg={6}>
      <Card className="h-100 shadow-sm border-0" style={{ borderRadius: '8px', minHeight: '372px' }}>
        <CardHeader className="border-0" style={{ backgroundColor: '#fbfcfe', padding: '22px 28px 18px' }}>
          <CardTitle as={'h4'} className="mb-0 fw-semibold" style={{ color: '#516986', fontSize: '17px' }}>
            Pending Settlements
          </CardTitle>
        </CardHeader>
        <CardBody style={{ padding: '18px 28px 18px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold" style={{ color: '#516986', fontSize: '15px' }}>Tenant / Property</span>
            <span className="fw-semibold" style={{ color: '#516986', fontSize: '15px' }}>Amount</span>
          </div>
          <div className="d-flex flex-column" style={{ gap: '14px' }}>
            {settlements.map((item, idx) => (
              <div key={idx} className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 fw-medium" style={{ color: '#516986', fontSize: '14px' }}>{item.name}</h6>
                  <span style={{ color: '#7488a4', fontSize: '13px' }}>{item.property}</span>
                </div>
                <span className="fw-medium text-nowrap ms-3" style={{ color: '#516986', fontSize: '15px' }}>{item.amount}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PendingSettlements;
