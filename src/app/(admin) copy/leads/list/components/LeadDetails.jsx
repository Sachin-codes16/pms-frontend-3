import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';

/* ─── Utility ──────────────────────────────────────────────────────────── */
const hasVal = (v) => v != null && String(v).trim() !== '';

const formatDate = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
};

/* ─── Field — renders null if value is empty ────────────────────────────── */
const Field = ({ label, value }) => {
  if (!hasVal(value)) return null;
  return (
    <Col lg={3} md={4} sm={6}>
      <div style={{ marginBottom: '1.4rem' }}>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#9ca3af',
            marginBottom: '0.3rem',
            textTransform: 'uppercase',
            letterSpacing: '0.9px',
            margin: '0 0 0.3rem 0',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: '0.925rem',
            fontWeight: 600,
            color: '#111827',
            margin: 0,
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </p>
      </div>
    </Col>
  );
};

/* ─── SectionCard ───────────────────────────────────────────────────────── */
const SectionCard = ({ title, icon, children }) => (
  <Card
    style={{
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      backgroundColor: '#fff',
    }}
  >
    <CardBody style={{ padding: '1.5rem 1.75rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1rem',
        }}
      >
        {icon && (
          <span
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
              flexShrink: 0,
            }}
          >
            <IconifyIcon icon={icon} width={14} />
          </span>
        )}
        <h5
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            margin: 0,
            color: '#111827',
            letterSpacing: '0.1px',
          }}
        >
          {title}
        </h5>
      </div>
      <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.1rem' }}>
        {children}
      </div>
    </CardBody>
  </Card>
);

/* ─── pill style ────────────────────────────────────────────────────────── */
const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: '3px 10px',
  borderRadius: '20px',
  background: '#f3f4f6',
  color: '#374151',
  fontSize: '0.78rem',
  fontWeight: 500,
  border: '1px solid #e5e7eb',
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
const LandlordDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Only leadId is passed from LeadList
  const leadId = location.state?.leadId ?? null;

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Fetch full landlord data by leadId ─────────────────────────────────── */
  useEffect(() => {
    if (!leadId) {
      setError('No Lead ID provided.');
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await httpClient.get(
          `${API_BASE_URL}/lead/get/?lead_id=${leadId}`,
          {
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
              Accept: 'application/json',
            },
          }
        );
        const d = res.data;
       
        const record = d?.data ?? d;
        if (record && (record.leadId || record.firstName)) {
          setLead(record);
        } else {
          setError('Could not load landlord details.');
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch landlord details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [leadId]);

  /* ── Loading state ──────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Spinner animation="border" variant="primary" />
        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
          Loading landlord details…
        </p>
      </div>
    );
  }

  /* ── Error / not found state ────────────────────────────────────────────── */
  if (error || !lead) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <IconifyIcon
          icon="ri:error-warning-line"
          width={48}
          style={{ color: '#ef4444', marginBottom: '1rem' }}
        />
        <p style={{ color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>
          {error || 'Landlord not found.'}
        </p>
        <button
          className="btn btn-primary btn-sm mt-2"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  /* ── Derived values ─────────────────────────────────────────────────────── */
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—';
  const initials  = (lead.firstName?.[0] ?? lead.lastName?.[0] ?? '?').toUpperCase();
  const phone     = lead.phoneNumber ?? lead.phone_number;
  const assigned  = lead.leadAssignTo;
  const perm      = lead.propertyPermission;

  /* ── Section visibility guards ──────────────────────────────────────────── */
  const showBasic = hasVal(phone) || hasVal(lead.email) || hasVal(lead.nationality) ||
    hasVal(lead.passportOrId) || hasVal(lead.leadOrigin) || hasVal(lead.purpose) || hasVal(lead.leadCategory);

  const showAddress = hasVal(lead.address) || hasVal(lead.city) ||
    hasVal(lead.state) || hasVal(lead.country);

  const showAssigned = assigned &&
    (hasVal(assigned.name) || hasVal(assigned.phoneNumber) || hasVal(assigned.email));

  const showPermission = perm &&
    (perm.permissionId != null || perm.property != null);

  const showSystem = hasVal(lead.createdAt) || hasVal(lead.updatedAt) || hasVal(lead.lead_assign_to_id);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>

        {/* ── Back button ─────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#3b82f6',
            fontWeight: 600,
            fontSize: '0.875rem',
            marginBottom: '1rem',
            padding: 0,
          }}
        >
          <IconifyIcon icon="ri:arrow-left-line" width={18} />
          Back to Landlord List
        </button>

        {/* ── Header card ─────────────────────────────────────────────────── */}
        <Card
          style={{
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            marginBottom: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            backgroundColor: '#fff',
          }}
        >
          <CardBody style={{ padding: '1.5rem 1.75rem' }}>

            {/* Top row: avatar + name + Lead ID chip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              {/* Avatar + name block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Initials avatar */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                  }}
                >
                  {initials}
                </div>

                <div>
                  {/* Name + badges row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      flexWrap: 'wrap',
                      marginBottom: '3px',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        margin: 0,
                        color: '#111827',
                      }}
                    >
                      {fullName}
                    </h2>

                    {/* Active/Inactive badge */}
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 9px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: lead.isActive ? '#dcfce7' : '#fee2e2',
                        color: lead.isActive ? '#15803d' : '#dc2626',
                        border: `1px solid ${lead.isActive ? '#bbf7d0' : '#fecaca'}`,
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: lead.isActive ? '#16a34a' : '#ef4444',
                          display: 'inline-block',
                        }}
                      />
                      {lead.isActive ? 'Active' : 'Inactive'}
                    </span>

                    {/* Purpose badge */}
                    {hasVal(lead.purpose) && (
                      <span
                        style={{
                          padding: '2px 9px',
                          borderRadius: '20px',
                          background: '#fef3c7',
                          color: '#92400e',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          border: '1px solid #fde68a',
                          textTransform: 'capitalize',
                        }}
                      >
                        {lead.purpose}
                      </span>
                    )}

                    {hasVal(lead.leadCategory) && (
                      <span style={{ padding: '2px 8px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '0.68rem', fontWeight: 700, border: '1px solid #fde68a', textTransform: 'capitalize' }}>
                        {lead.leadCategory}
                      </span>
                    )}
                  </div>

                  {/* Address sub-line */}
                  {hasVal(lead.address) && (
                    <p
                      style={{
                        margin: 0,
                        color: '#6b7280',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <IconifyIcon icon="ri:map-pin-2-line" width={12} />
                      {lead.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Lead ID chip */}
              {hasVal(lead.leadId) && (
                <div
                  style={{
                    padding: '6px 14px',
                    background: '#eff6ff',
                    borderRadius: '8px',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <IconifyIcon icon="ri:fingerprint-line" width={14} />
                  Lead #{lead.leadId}
                </div>
              )}
            </div>

            {/* Quick-info pills row */}
            {(hasVal(phone) || hasVal(lead.email) || hasVal(lead.city) ||
              hasVal(lead.nationality) || hasVal(lead.leadOrigin)) && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                {hasVal(phone) && (
                  <span style={pill}>
                    <IconifyIcon icon="ri:phone-line" width={12} /> {phone}
                  </span>
                )}
                {hasVal(lead.email) && (
                  <span style={pill}>
                    <IconifyIcon icon="ri:mail-line" width={12} /> {lead.email}
                  </span>
                )}
                {hasVal(lead.city) && (
                  <span style={pill}>
                    <IconifyIcon icon="ri:building-2-line" width={12} />
                    {lead.city}{lead.country ? `, ${lead.country}` : ''}
                  </span>
                )}
                {hasVal(lead.nationality) && (
                  <span style={pill}>
                    <IconifyIcon icon="ri:global-line" width={12} /> {lead.nationality}
                  </span>
                )}
                {hasVal(lead.leadOrigin) && (
                  <span style={pill}>
                    <IconifyIcon icon="ri:share-forward-line" width={12} /> {lead.leadOrigin}
                  </span>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {/* ── 1. Basic Profile ────────────────────────────────────────────── */}
        {showBasic && (
          <SectionCard title="Basic Profile" icon="ri:user-3-line">
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
          </SectionCard>
        )}

        {/* ── 2. Address ──────────────────────────────────────────────────── */}
        {showAddress && (
          <SectionCard title="Address" icon="ri:map-pin-2-line">
            <Row>
              <Field label="Full Address" value={lead.address} />
              <Field label="City"         value={lead.city} />
              <Field label="State"        value={lead.state} />
              <Field label="Country"      value={lead.country} />
            </Row>
          </SectionCard>
        )}

        {/* ── 3. Assigned Agent ───────────────────────────────────────────── */}
        {showAssigned && (
          <SectionCard title="Assigned Agent" icon="ri:user-settings-line">
            <Row>
              <Field label="Agent Name"  value={assigned.name} />
              <Field label="Agent Phone" value={assigned.phoneNumber} />
              <Field label="Agent Email" value={assigned.email} />
            </Row>
          </SectionCard>
        )}

        {/* ── 4. Property Permission ──────────────────────────────────────── */}
        {showPermission && (
          <SectionCard title="Property Permission" icon="ri:home-gear-line">
            <Row>
              {perm.permissionId != null && (
                <Field label="Permission ID"   value={String(perm.permissionId)} />
              )}
              {perm.property != null && (
                <Field label="Property Access" value={perm.property ? 'Allowed' : 'Not Allowed'} />
              )}
            </Row>
          </SectionCard>
        )}

        {/* ── 5. System Information ───────────────────────────────────────── */}
        {showSystem && (
          <SectionCard title="System Information" icon="ri:information-line">
            <Row>
              <Field label="Lead ID"       value={lead.leadId ? String(lead.leadId) : null} />
              <Field label="Assign To ID"  value={lead.lead_assign_to_id ? String(lead.lead_assign_to_id) : null} />
              <Field label="Created On"    value={formatDate(lead.createdAt)} />
              <Field label="Last Updated"  value={formatDate(lead.updatedAt)} />
            </Row>
          </SectionCard>
        )}

      </div>
    </div>
  );
};

export default LandlordDetails;