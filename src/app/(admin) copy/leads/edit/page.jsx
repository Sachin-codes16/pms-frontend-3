import PageTitle from '@/components/PageTitle';
import CustomerAddCard from '@/app/(admin)/customers/add/components/CustomerAddCard';
import AddCustomer from '@/app/(admin)/customers/add/components/AddCustomer';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

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

const LeadEditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;
  const [formPreview, setFormPreview] = useState({});

  const initialPreview = useMemo(() => {
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
    };
  }, [lead]);

  const preview = Object.keys(formPreview).length ? formPreview : initialPreview;

  if (!lead) {
    return (
      <>
        <PageTitle title="Update Lead" subName="Lead not found" />
        <Card>
          <CardBody className="text-center py-5">
            <p className="text-muted mb-3">
              No lead data available. Go back to the list and open Edit from the lead row.
            </p>
            <button type="button" className="btn btn-primary" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </CardBody>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Update Lead" subName="Edit lead details" />
      <Row>
        <CustomerAddCard preview={preview} />
        <Col xl={9} lg={12}>
          {/* <FileUpload title="Profile Photo" /> */}
          <AddCustomer
            initialData={lead}
            mode="update"
            onFormValuesChange={setFormPreview}
          />
        </Col>
      </Row>
    </>
  );
};

export default LeadEditPage;

