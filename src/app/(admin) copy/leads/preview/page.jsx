import PageTitle from '@/components/PageTitle';
import CustomerAddCard from '@/app/(admin)/leads/preview/CustomerAddCard';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const DetailRow = ({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom border-light">
    <span className="text-muted">{label}</span>
    <span className="fw-medium text-end" style={{ maxWidth: '60%' }}>
      {value ?? '—'}
    </span>
  </div>
);

const LeadPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;

  const preview = useMemo(() => {
    if (!lead) return {};
    const purpose = lead.purpose ?? '';
    const leadType = purpose
      ? purpose.charAt(0).toUpperCase() + purpose.slice(1).replace(/_/g, ' ')
      : '—';
    return {
      first_name: lead.firstName ?? lead.first_name,
      last_name: lead.lastName ?? lead.last_name,
      phone: lead.phone_number ?? lead.phoneNumber,
      description: lead.address,
      email: lead.email,
      leadType,
      leadId: lead.leadId ?? lead.lead_id,
      status: lead.isActive ? 'Active' : 'Inactive',
      createdAt: formatDate(lead.createdAt ?? lead.created_at),
      updatedAt: formatDate(lead.updatedAt ?? lead.updated_at),
      profileImage: lead.profileImage ?? lead.profile_image ?? null,
      leadCategory: lead.leadCategory ?? lead.lead_category, // ← ADDED
    };
  }, [lead]);

  if (!lead) {
    return (
      <>
        <PageTitle title="Lead Preview" subName="Lead not found" />
        <Card>
          <CardBody className="text-center py-5">
            <p className="text-muted mb-3">
              No lead data available. Go back to the list and open a lead from the eye icon.
            </p>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Lead Preview" subName="Read only" />
      <Row>
        <CustomerAddCard preview={preview} />
        <Col xl={9} lg={12}>
          <Card>
            <CardBody>
              <h5 className="mb-3 text-muted">Lead Information (Read Only)</h5>
              <Row>
                <Col md={6}>
                  <DetailRow label="Lead ID" value={lead.leadId ?? lead.lead_id} />
                  <DetailRow label="First Name" value={lead.firstName ?? lead.first_name} />
                  <DetailRow label="Last Name" value={lead.lastName ?? lead.last_name} />
                  <DetailRow
                    label="Contact Number"
                    value={lead.phone_number ?? lead.phoneNumber}
                  />
                  <DetailRow label="Address" value={lead.address} />
                  <DetailRow label="Purpose / Type" value={lead.purpose} />
                  <DetailRow label="Lead Category" value={lead.leadCategory ?? lead.lead_category} />
                  <DetailRow label="Origin" value={lead.leadOrigin ?? lead.lead_origin} />
                </Col>
                <Col md={6}>
                  <DetailRow
                    label="Assigned To (User ID)"
                    value={lead.lead_assign_to_id ?? lead.leadAssignTo?.userId}
                  />
                  <DetailRow
                    label="Assignee Phone"
                    value={lead.leadAssignTo?.phoneNumber}
                  />
                  <DetailRow label="Assignee Email" value={lead.leadAssignTo?.email} />
                  <DetailRow label="Nationality" value={lead.nationality} />
                  <DetailRow
                    label="Passport / ID"
                    value={lead.passportOrId ?? lead.passport_or_id}
                  />
                  <DetailRow label="Country" value={lead.country} />
                  <DetailRow label="City" value={lead.city} />
                  <DetailRow label="Created" value={formatDate(lead.createdAt)} />
                  <DetailRow label="Updated" value={formatDate(lead.updatedAt)} />
                  <DetailRow label="Status" value={lead.isActive ? 'Active' : 'Inactive'} />
                </Col>
              </Row>
              <div className="mt-4 pt-3 border-top">
                <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                  Back to List
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default LeadPreviewPage;