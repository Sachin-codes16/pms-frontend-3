import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';
import { API_BASE_URL } from '@/constants/api';
import httpClient from '@/helpers/httpClient';

/* ─── helpers ────────────────────────────────────────────────────────────── */
const hasVal = (v) => v != null && String(v).trim() !== '';

const fmt = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
};

/* ─── Field ─────────────────────────────────────────────────────────────── */
const Field = ({ label, value }) => {
  if (!hasVal(value)) return null;
  return (
    <Col lg={3} md={4} sm={6}>
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{
          fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af',
          margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.9px',
        }}>
          {label}
        </p>
        <p style={{
          fontSize: '0.9rem', fontWeight: 600, color: '#111827',
          margin: 0, lineHeight: 1.5, wordBreak: 'break-word',
        }}>
          {value}
        </p>
      </div>
    </Col>
  );
};

/* ─── Section card ───────────────────────────────────────────────────────── */
const Section = ({ title, icon, children }) => (
  <Card style={{
    borderRadius: '10px', border: '1px solid #e5e7eb',
    marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', background: '#fff',
  }}>
    <CardBody style={{ padding: '1.4rem 1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
        <span style={{
          width: '27px', height: '27px', borderRadius: '7px',
          background: '#f0fdf4', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#22c55e', flexShrink: 0,
        }}>
          <IconifyIcon icon={icon} width={14} />
        </span>
        <h5 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#111827' }}>
          {title}
        </h5>
      </div>
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
        {children}
      </div>
    </CardBody>
  </Card>
);

/* ─── Pill style ─────────────────────────────────────────────────────────── */
const pill = {
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: '3px 10px', borderRadius: '20px',
  background: '#f3f4f6', color: '#374151',
  fontSize: '0.775rem', fontWeight: 500, border: '1px solid #e5e7eb',
};

/* ─── Status Badge ───────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    Pending:    { bg: '#fef9c3', color: '#854d0e', border: '#fde68a' },
    Active:     { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
    Completed:  { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
    Terminated: { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' },
  };
  const s = map[status] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
  return (
    <span style={{
      padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem',
      fontWeight: 700, background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      {status || 'Unknown'}
    </span>
  );
};

/* ─── Property Linked Row ────────────────────────────────────────────────── */
const PropertyRow = ({ assignment, isLast }) => {
  const prop = assignment.property || {};
  const API_ORIGIN = 'https://essdemo.alwijha.net';

  // Build photo URL
  const photos = prop.photos || [];
  const photoUrl = photos.length > 0
    ? (photos[0].startsWith('http') ? photos[0] : `${API_ORIGIN}${photos[0]}`)
    : null;

  const propertyName = [
    prop.buildingDetails || prop.block,
    prop.flatNumber ? `Unit ${prop.flatNumber}` : null,
  ].filter(Boolean).join(' - ') || `Property #${prop.propertyId}`;

  const propertyType = prop.rentalType
    ? prop.rentalType.charAt(0).toUpperCase() + prop.rentalType.slice(1)
    : prop.flatData ? 'Flat' : prop.villaData ? 'Villa' : prop.commercialData ? 'Commercial' : 'Property';

  // const location = prop.propertyDetails?.location || prop.location || prop.city || '—';
  const propertyCode = `PRP-${String(prop.propertyId || '').padStart(5, '0')}`;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.25rem',
      padding: '1rem 0',
      borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
      flexWrap: 'wrap',
    }}>
      {/* Photo */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '10px',
        overflow: 'hidden', flexShrink: 0,
        background: '#f3f4f6', border: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {photoUrl ? (
          <img src={photoUrl} alt="property"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <IconifyIcon icon="ri:building-2-line" width={22} color="#9ca3af" />
        )}
      </div>

      {/* Details grid */}
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>

        {/* Property Code */}
        <div style={{ maxWidth: 'fit-content', margin: '10px 15px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Property Code
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            {propertyCode}
          </p>
        </div>

        {/* Property Name */}
        <div style={{ maxWidth: 'fit-content', margin: '10px 15px', flex: 1 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Property Name
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            {propertyName}
          </p>
        </div>

        {/* Property Type */}
        <div style={{ maxWidth: 'fit-content', margin: '10px 15px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Property Type
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            {propertyType}
          </p>
        </div>

        {/* Location */}
        {/* <div style={{ maxWidth: 'fit-content', margin: '10px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Location
          </p>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase' }}>
            {location}
          </p>
        </div> */}

        {/* Rental Dates */}
        {(hasVal(assignment.rentalStartDate) || hasVal(assignment.rentalEndDate)) && (
          <div style={{ maxWidth: 'fit-content', margin: '10px 15px' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Rental Period
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', margin: 0 }}>
              {fmt(assignment.rentalStartDate)} → {fmt(assignment.rentalEndDate)}
            </p>
          </div>
        )}

        {/* Status */}
        <div style={{ maxWidth: 'fit-content', margin: '10px 15px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Assignment Status
          </p>
          <StatusBadge status={assignment.assignementStatus || assignment.assignment_status} />
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════════ */
const TenantDetails = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const leadId = state?.leadId ?? state?.user?.leadId ?? state?.user?.lead_id;

  const [lead,              setLead]              = useState(null);
  const [loading,           setLoading]           = useState(true);
  const [error,             setError]             = useState(null);

  // ✅ NEW: assigned properties state
  const [assignments,       setAssignments]       = useState([]);
  const [assignLoading,     setAssignLoading]     = useState(false);

  /* ── Fetch tenant details ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!leadId) {
      setError('Lead ID not provided. Please go back and click a tenant name.');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await httpClient.get(
          `${API_BASE_URL}/lead/get/?lead_id=${leadId}`
        );
        const record = res.data?.data ?? res.data;
        if (record && (record.leadId != null || record.firstName)) {
          setLead(record);
        } else {
          setError('No data returned for this tenant.');
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch tenant details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [leadId]);

  /* ── Fetch assigned properties ─────────────────────────────────────────── */
  
  useEffect(() => {
    if (!leadId) return;

    (async () => {
      setAssignLoading(true);
      try {
        const res = await httpClient.get(`${API_BASE_URL}/property/assignment/get_all/`);
        const all = res.data?.data?.data || res.data?.data || [];

        const tenantAssignments = all.filter(
          (a) => a.tenant?.tenantId === leadId || a.tenant?.tenantId === parseInt(leadId)
        );
        setAssignments(tenantAssignments);
      } catch (e) {
        console.error('Failed to fetch assignments:', e);
        
      } finally {
        setAssignLoading(false);
      }
    })();
  }, [leadId]);

  /* ── Loading ────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Spinner animation="border" variant="success" />
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Fetching tenant details…</p>
      </div>
    );
  }

  /* ── Error ──────────────────────────────────────────────────────────────── */
  if (error || !lead) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <IconifyIcon icon="ri:error-warning-line" width={48} style={{ color: '#ef4444', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
        <p style={{ color: '#374151', fontWeight: 600, marginBottom: '1rem' }}>{error || 'Tenant not found.'}</p>
        <button className="btn btn-success btn-sm" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  /* ── Derived ────────────────────────────────────────────────────────────── */
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—';
  const initials = (lead.firstName?.[0] ?? lead.lastName?.[0] ?? '?').toUpperCase();
  const phone    = lead.phoneNumber ?? lead.phone_number;
  const assigned = lead.leadAssignTo;
  const perm     = lead.propertyPermission;

  const showBasic    = hasVal(phone) || hasVal(lead.email) || hasVal(lead.nationality) ||
                       hasVal(lead.passportOrId) || hasVal(lead.leadOrigin) || hasVal(lead.purpose);
  const showAddress  = hasVal(lead.address) || hasVal(lead.city) || hasVal(lead.state) || hasVal(lead.country);
  const showAssigned = assigned && (hasVal(assigned.name) || hasVal(assigned.phoneNumber) || hasVal(assigned.email));
  const showPerm     = perm && (perm.permissionId != null || perm.property != null);
  const showSystem   = hasVal(lead.createdAt) || hasVal(lead.updatedAt) || hasVal(lead.lead_assign_to_id);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
        >
          <IconifyIcon icon="ri:arrow-left-line" width={17} />
          Back to Tenant List
        </button>

        {/* ── Header card ──────────────────────────────────────────────────── */}
        <Card style={{ borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', background: '#fff' }}>
          <CardBody style={{ padding: '1.5rem 1.75rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1.2rem', fontWeight: 800, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(34,197,94,0.25)',
                }}>
                  {initials}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                      {fullName}
                    </h2>

                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700,
                      background: lead.isActive ? '#dcfce7' : '#fee2e2',
                      color:      lead.isActive ? '#15803d' : '#dc2626',
                      border: `1px solid ${lead.isActive ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: lead.isActive ? '#16a34a' : '#ef4444', display: 'inline-block' }} />
                      {lead.isActive ? 'Active' : 'Inactive'}
                    </span>

                    {hasVal(lead.purpose) && (
                      <span style={{ padding: '2px 8px', borderRadius: '20px', background: '#dcfce7', color: '#166534', fontSize: '0.68rem', fontWeight: 700, border: '1px solid #bbf7d0', textTransform: 'capitalize' }}>
                        {lead.purpose}
                      </span>
                    )}
                  </div>

                  {hasVal(lead.address) && (
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconifyIcon icon="ri:map-pin-2-line" width={12} />
                      {lead.address}
                    </p>
                  )}
                </div>
              </div>

              {hasVal(lead.leadId) && (
                <div style={{ padding: '6px 13px', background: '#f0fdf4', borderRadius: '8px', color: '#16a34a', fontWeight: 700, fontSize: '0.8rem', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <IconifyIcon icon="ri:fingerprint-line" width={14} />
                  Lead #{lead.leadId}
                </div>
              )}
            </div>

            {(hasVal(phone) || hasVal(lead.email) || hasVal(lead.city) || hasVal(lead.nationality) || hasVal(lead.leadOrigin)) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                {hasVal(phone)            && <span style={pill}><IconifyIcon icon="ri:phone-line"         width={12} /> {phone}</span>}
                {hasVal(lead.email)       && <span style={pill}><IconifyIcon icon="ri:mail-line"           width={12} /> {lead.email}</span>}
                {hasVal(lead.city)        && <span style={pill}><IconifyIcon icon="ri:building-2-line"     width={12} /> {lead.city}{lead.country ? `, ${lead.country}` : ''}</span>}
                {hasVal(lead.nationality) && <span style={pill}><IconifyIcon icon="ri:global-line"         width={12} /> {lead.nationality}</span>}
                {hasVal(lead.leadOrigin)  && <span style={pill}><IconifyIcon icon="ri:share-forward-line"  width={12} /> {lead.leadOrigin}</span>}
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── 1. Basic Profile ─────────────────────────────────────────────── */}
        {showBasic && (
          <Section title="Basic Profile" icon="ri:user-3-line">
            <Row>
              <Field label="Full Name"     value={fullName !== '—' ? fullName : null} />
              <Field label="Mobile Number" value={phone} />
              <Field label="Email Address" value={lead.email} />
              <Field label="Nationality"   value={lead.nationality} />
              <Field label="Passport / ID" value={lead.passportOrId} />
              <Field label="Lead Origin"   value={lead.leadOrigin} />
              <Field label="Purpose"       value={lead.purpose} />
              <Field label="Lead Category"  value={lead.leadCategory} />
            </Row>
          </Section>
        )}

        {/* ── 2. Address ───────────────────────────────────────────────────── */}
        {showAddress && (
          <Section title="Address" icon="ri:map-pin-2-line">
            <Row>
              <Field label="Full Address" value={lead.address} />
              <Field label="City"         value={lead.city} />
              <Field label="State"        value={lead.state} />
              <Field label="Country"      value={lead.country} />
            </Row>
          </Section>
        )}

        {/* ── 3. Assigned Agent ────────────────────────────────────────────── */}
        {showAssigned && (
          <Section title="Assigned Agent" icon="ri:user-settings-line">
            <Row>
              <Field label="Agent Name"  value={assigned.name} />
              <Field label="Agent Phone" value={assigned.phoneNumber} />
              <Field label="Agent Email" value={assigned.email} />
            </Row>
          </Section>
        )}

        {/* ── 4. Property Permission ───────────────────────────────────────── */}
        {showPerm && (
          <Section title="Property Permission" icon="ri:home-gear-line">
            <Row>
              {perm.permissionId != null && <Field label="Permission ID"   value={String(perm.permissionId)} />}
              {perm.property     != null && <Field label="Property Access" value={perm.property ? 'Allowed' : 'Not Allowed'} />}
            </Row>
          </Section>
        )}

        {/* ── 5. Property Linked ───────────────────────────────────────────── */}
        <Card style={{
          borderRadius: '10px', border: '1px solid #e5e7eb',
          marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', background: '#fff',
        }}>
          <CardBody style={{ padding: '1.4rem 1.75rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '27px', height: '27px', borderRadius: '7px',
                  background: '#f0fdf4', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#22c55e', flexShrink: 0,
                }}>
                  <IconifyIcon icon="ri:links-line" width={14} />
                </span>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                  Property Linked
                </h5>
              </div>

              {/* Count badge */}
              {!assignLoading && (
                <span style={{
                  padding: '2px 10px', borderRadius: '20px',
                  background: assignments.length > 0 ? '#dcfce7' : '#f3f4f6',
                  color: assignments.length > 0 ? '#15803d' : '#6b7280',
                  fontSize: '0.72rem', fontWeight: 700,
                  border: `1px solid ${assignments.length > 0 ? '#bbf7d0' : '#e5e7eb'}`,
                }}>
                  {assignments.length} {assignments.length === 1 ? 'Property' : 'Properties'}
                </span>
              )}
            </div>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.5rem' }}>

              {/* Loading */}
              {assignLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '1.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  <Spinner animation="border" size="sm" variant="success" />
                  Loading assigned properties…
                </div>
              )}

              {/* Empty */}
              {!assignLoading && assignments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#9ca3af' }}>
                  <IconifyIcon icon="ri:building-2-line" width={32} style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>No properties linked to this tenant yet.</p>
                </div>
              )}

              {/* List */}
              {!assignLoading && assignments.map((assignment, idx) => (
                <PropertyRow
                  key={assignment.assignmentId || idx}
                  assignment={assignment}
                  isLast={idx === assignments.length - 1}
                />
              ))}

            </div>
          </CardBody>
        </Card>

        {/* ── 6. System Information ────────────────────────────────────────── */}
        {showSystem && (
          <Section title="System Information" icon="ri:information-line">
            <Row>
              <Field label="Lead ID"      value={lead.leadId ? String(lead.leadId) : null} />
              <Field label="Assign To ID" value={lead.lead_assign_to_id ? String(lead.lead_assign_to_id) : null} />
              <Field label="Created On"   value={fmt(lead.createdAt)} />
              <Field label="Last Updated" value={fmt(lead.updatedAt)} />
            </Row>
          </Section>
        )}

      </div>
    </div>
  );
};

export default TenantDetails;