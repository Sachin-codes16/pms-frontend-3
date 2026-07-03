// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";

// nested path in item → flat camelCase fallback handled by getValue()
const FIELD_PATHS = {
  inspection_type:       ['inspection', 'inspectionOverview', 'inspectionType'],
  inspection_date:       ['inspection', 'inspectionOverview', 'inspectionDate'],
  inspector:             ['inspection', 'inspectionOverview', 'inspector'],
  inspection_duration:   ['inspection', 'inspectionOverview', 'inspectionDuration'],
  overall_status:        ['inspection', 'inspectionOverview', 'overallStatus'],
  next_inspection_due:   ['inspection', 'inspectionOverview', 'nextInspectionDue'],
  priority:              ['inspection', 'inspectionOverview', 'priority'],
  issue_identified:      [],   // flat: issueIdentified
  supervisor_remarks:    [],   // flat: supervisorRemarks
  internal_comments:     [],   // flat: internalComments
};

const getValue = (item, name) => {
  const path = FIELD_PATHS[name];
  if (path && path.length > 0) {
    const nested = path.reduce((acc, key) => acc?.[key], item);
    if (nested !== null && nested !== undefined) return nested;
  }
  const camelKey = name.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const flat = item?.[camelKey];
  return flat === null || flat === undefined ? '' : flat;
};

const toDateString = (iso) => (iso ? String(iso).split('T')[0] : '');

const fieldStyle = {
  background: '#f9f9fc',
  border: '1px solid #e7e9ef',
  borderRadius: 5,
  color: '#526b89',
  fontSize: 16,
  height: 46,
  padding: '10px 14px',
  width: '100%',
};

const labelStyle = {
  color: '#526b89',
  fontSize: 16,
  fontWeight: 500,
  marginBottom: 10,
};

const sectionTitleStyle = {
  borderBottom: '1px solid #dfe3e8',
  color: '#526b89',
  fontSize: 21,
  fontWeight: 700,
  marginBottom: 20,
  paddingBottom: 16,
  scrollMarginTop: 110,
};

const readOnlyStyle = {
  ...fieldStyle,
  background: '#f3f4f8',
  color: '#8a96a8',
  cursor: 'not-allowed',
};

const Field = ({ label, name, type = 'text', defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input
      type={type}
      name={name}
      defaultValue={defaultValue ?? ''}
      readOnly={readOnly}
      style={readOnly ? readOnlyStyle : fieldStyle}
    />
  </div>
);

const SelectField = ({ label, name, defaultValue, options }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <select name={name} defaultValue={defaultValue ?? ''} style={fieldStyle}>
      <option value="">— Select —</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

const TextArea = ({ label, name, defaultValue, readOnly }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <textarea
      name={name}
      defaultValue={defaultValue ?? ''}
      readOnly={readOnly}
      style={{ ...fieldStyle, height: 'auto', minHeight: 94, resize: 'none', ...(readOnly && { background: '#f3f4f8', color: '#8a96a8', cursor: 'not-allowed' }) }}
    />
  </div>
);

const InspectionEditDetailsPage = ({ mode = 'check-in' }) => {
  const location  = useLocation();
  const isCheckOut = mode === 'check-out';
  const backPath  = isCheckOut ? '/check-out-dashboard' : '/check-in-dashboard';
  const params    = new URLSearchParams(location.search);
  const id        = params.get('id');

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef   = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const gv = (name) => getValue(item, name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!id) {
      alert('Cannot submit: no check-in id in the URL.');
      return;
    }
    const formData = new FormData(formRef.current);
    const body = {};
    for (const [k, v] of formData.entries()) {
      if (v === '') continue;
      body[k] = v;
    }
    try {
      setSubmitting(true);
      await updateSections(id, { property_inspection: body });
      await fetchItem();
      setSubmitting(false);
      toast.success('Inspection details updated successfully');
      alert('Inspection details updated successfully.');
    } catch (err) {
      setSubmitting(false);
      const res = err?.response?.data;
      const message = res ? JSON.stringify(res) : err?.message || 'Something went wrong';
      toast.error(message);
      alert(message);
    }
  };

  return (
    <div>
      {/* Back + title */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          as={Link}
          to={backPath}
          variant="link"
          className="p-0 d-flex align-items-center justify-content-center"
          style={{ border: '1px solid #8a96a8', borderRadius: '50%', color: '#2f3848', height: 32, textDecoration: 'none', width: 32 }}
        >
          <IconifyIcon icon="ri:arrow-left-s-line" width={20} height={20} />
        </Button>
        <h4 className="mb-0" style={{ color: '#526b89', fontSize: 20, fontWeight: 500 }}>
          {isCheckOut ? 'Check-Out' : 'Check-In'} Information
        </h4>
      </div>

      <form key={loading ? 'loading' : id || 'new'} ref={formRef} onSubmit={handleSubmit}>
        <Row className="g-4 align-items-start">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <Col xs={12} lg={3}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: '0 10px 30px rgba(16,24,40,0.07)' }}>
              <CardBody style={{ padding: 24 }}>
                {loading ? (
                  <div className="d-flex justify-content-center" style={{ padding: 24 }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <h5 className="mb-1" style={{ color: '#526b89', fontSize: 18, fontWeight: 700 }}>
                      {item?.tenantName || '—'}
                    </h5>
                    <div className="d-flex flex-column gap-1 mb-4" style={{ color: '#526b89', fontSize: 14 }}>
                      <span>{item?.tenantEmail || item?.tenantDetails?.contactDetails?.tenantEmail || '—'}</span>
                      <span>{item?.tenantMobileNumber || item?.tenantDetails?.contactDetails?.tenantMobileNumber || '—'}</span>
                    </div>

                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>Check-In Date</p>
                        <p className="mb-0" style={{ color: '#526b89', fontSize: 14 }}>{item?.checkInDate || '—'}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>Status</p>
                        <p className="mb-0" style={{ color: '#526b89', fontSize: 14 }}>{item?.checkInStatus || '—'}</p>
                      </Col>
                    </Row>

                    <h6 className="mb-3" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>Property Details</h6>
                    <Row className="g-3 mb-4">
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: '#526b89', fontSize: 14 }}>Type</p>
                        <p className="mb-0" style={{ color: '#526b89', fontSize: 14, fontWeight: 700 }}>{item?.propertyType || '—'}</p>
                      </Col>
                      <Col xs={6}>
                        <p className="mb-1" style={{ color: '#526b89', fontSize: 14 }}>Status</p>
                        <p className="mb-0" style={{ color: '#526b89', fontSize: 14, fontWeight: 700 }}>{item?.propertyStatus || '—'}</p>
                      </Col>
                    </Row>
                  </>
                )}

                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to={backPath}
                    variant="outline-secondary"
                    className="w-50"
                    style={{ borderColor: '#526b89', borderRadius: 5, color: '#526b89', height: 40 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-50"
                    style={{ background: '#526b89', borderColor: '#526b89', borderRadius: 5, height: 40 }}
                  >
                    {submitting ? 'Saving…' : 'Submit'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* ── Main form ───────────────────────────────────────────────── */}
          <Col xs={12} lg={9}>
            <Card className="border-0 shadow-sm" style={{ borderRadius: 10, boxShadow: '0 10px 30px rgba(16,24,40,0.07)', overflow: 'hidden' }}>
              <CardBody style={{ padding: 0 }}>
                <h3 className="mb-0" style={{ borderBottom: '1px solid #edf0f3', color: '#526b89', fontSize: 26, fontWeight: 700, padding: '30px 36px 28px' }}>
                  Inspection Details
                </h3>

                <div style={{ padding: '34px 36px' }}>

                  {/* Section A — Inspection Overview */}
                  <h5 id="property-inspection" style={sectionTitleStyle}>A. Inspection Overview</h5>
                  <Row className="g-4 mb-5">
                    <Col md={4}>
                      <SelectField
                        label="Inspection Type"
                        name="inspection_type"
                        defaultValue={gv('inspection_type')}
                        options={['Move-In Inspection', 'Move-Out Inspection', 'Routine Inspection', 'Emergency Inspection']}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Inspection Date"
                        name="inspection_date"
                        type="date"
                        defaultValue={toDateString(gv('inspection_date'))}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Inspector"
                        name="inspector"
                        defaultValue={gv('inspector')}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Inspection Duration"
                        name="inspection_duration"
                        defaultValue={gv('inspection_duration')}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Overall Status"
                        name="overall_status"
                        defaultValue={gv('overall_status')}
                        options={['Good', 'Fair', 'Poor', 'Issues Found']}
                      />
                    </Col>
                    <Col md={4}>
                      <Field
                        label="Next Inspection Due"
                        name="next_inspection_due"
                        type="date"
                        defaultValue={toDateString(gv('next_inspection_due'))}
                      />
                    </Col>
                    <Col md={4}>
                      <SelectField
                        label="Priority"
                        name="priority"
                        defaultValue={gv('priority')}
                        options={['Low', 'Medium', 'High']}
                      />
                    </Col>
                  </Row>

                  {/* Section B — Remarks */}
                  <h5 id="remarks" style={sectionTitleStyle}>B. Remarks</h5>
                  <Row className="g-4 mb-5">
                    <Col md={12}>
                      <TextArea
                        label="Issues Identified"
                        name="issue_identified"
                        defaultValue={gv('issue_identified')}
                      />
                    </Col>
                    <Col md={12}>
                      <TextArea
                        label="Supervisor Remarks"
                        name="supervisor_remarks"
                        defaultValue={gv('supervisor_remarks')}
                      />
                    </Col>
                    <Col md={12}>
                      <TextArea
                        label="Internal Comments"
                        name="internal_comments"
                        defaultValue={gv('internal_comments')}
                      />
                    </Col>
                  </Row>

                  {/* Section C — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>C. System Fields</h5>
                  <Row className="g-4 mb-4">
                    <Col md={4}>
                      <Field label="Created By" defaultValue={item?.createdBy?.name ?? ''} readOnly />
                    </Col>
                    <Col md={4}>
                      <Field label="Created On" defaultValue={toDateString(item?.createdAt)} readOnly />
                    </Col>
                    <Col md={4}>
                      <Field label="Last Updated" defaultValue={toDateString(item?.updatedAt)} readOnly />
                    </Col>
                  </Row>

                  {/* Footer actions */}
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <Button
                      as={Link}
                      to={backPath}
                      variant="outline-secondary"
                      style={{ borderColor: '#526b89', borderRadius: 5, color: '#526b89', height: 45, minWidth: 200 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      style={{ background: '#526b89', borderColor: '#526b89', borderRadius: 5, height: 45, minWidth: 200 }}
                    >
                      {submitting ? 'Saving…' : 'Submit'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default InspectionEditDetailsPage;
