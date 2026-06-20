import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Row, Spinner } from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
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
          background: '#eff6ff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#3b82f6', flexShrink: 0,
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

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════════ */
const LandlordDetails = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  // ✅ LeadList sends: navigate('/Landlord-Details', { state: { leadId } })
  const leadId = state?.leadId;

  const [lead,    setLead]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  /* ── Fetch by leadId ───────────────────────────────────────────────────── */
  useEffect(() => {
    if (!leadId) {
      setError('Lead ID not provided. Please go back and click a landlord name.');
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await httpClient.get(
          `${API_BASE_URL}/lead/get/?lead_id=${leadId}`,
          { headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' } }
        );

        // API shape: { status, data: { ...lead } }  OR  { data: { ...lead } }
        const record = res.data?.data ?? res.data;

        if (record && (record.leadId != null || record.firstName)) {
          setLead(record);
        } else {
          setError('No data returned for this landlord.');
        }
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || 'Failed to fetch landlord details.');
      } finally {
        setLoading(false);
      }
    })();
  }, [leadId]);

  /* ── Loading ────────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Fetching landlord details…</p>
      </div>
    );
  }

  /* ── Error ──────────────────────────────────────────────────────────────── */
  if (error || !lead) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <IconifyIcon icon="ri:error-warning-line" width={48} style={{ color: '#ef4444', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
        <p style={{ color: '#374151', fontWeight: 600, marginBottom: '1rem' }}>{error || 'Landlord not found.'}</p>
        <button className="btn btn-primary btn-sm" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  /* ── Derived ────────────────────────────────────────────────────────────── */
  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—';
  const initials = (lead.firstName?.[0] ?? lead.lastName?.[0] ?? '?').toUpperCase();
  const phone    = lead.phoneNumber ?? lead.phone_number;
  const assigned = lead.leadAssignTo;
  const perm     = lead.propertyPermission;

  /* ── Section guards — only show if ≥1 real value ────────────────────────── */
  const showBasic    = hasVal(phone) || hasVal(lead.email) || hasVal(lead.nationality) ||
                       hasVal(lead.passportOrId) || hasVal(lead.leadOrigin) || hasVal(lead.purpose) || hasVal(lead.leadCategory);  
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
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
        >
          <IconifyIcon icon="ri:arrow-left-line" width={17} />
          Back to Landlord List
        </button>

        {/* ── Header card ──────────────────────────────────────────────────── */}
        <Card style={{ borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', background: '#fff' }}>
          <CardBody style={{ padding: '1.5rem 1.75rem' }}>

            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '1.2rem', fontWeight: 800, flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                }}>
                  {initials}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                      {fullName}
                    </h2>

                    {/* Active badge */}
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

                    {/* Purpose badge */}
                    {hasVal(lead.purpose) && (
                      <span style={{ padding: '2px 8px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '0.68rem', fontWeight: 700, border: '1px solid #fde68a', textTransform: 'capitalize' }}>
                        {lead.purpose}
                      </span>
                    )}

                    {hasVal(lead.leadCategory) && (
                      <span style={{ padding: '2px 8px', borderRadius: '20px', background: '#fef3c7', color: '#92400e', fontSize: '0.68rem', fontWeight: 700, border: '1px solid #fde68a', textTransform: 'capitalize' }}>
                        {lead.leadCategory}
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

              {/* Lead ID chip */}
              {hasVal(lead.leadId) && (
                <div style={{ padding: '6px 13px', background: '#eff6ff', borderRadius: '8px', color: '#2563eb', fontWeight: 700, fontSize: '0.8rem', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <IconifyIcon icon="ri:fingerprint-line" width={14} />
                  Lead #{lead.leadId}
                </div>
              )}
            </div>

            {/* Quick pills */}
            {(hasVal(phone) || hasVal(lead.email) || hasVal(lead.city) || hasVal(lead.nationality) || hasVal(lead.leadOrigin)) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                {hasVal(phone)           && <span style={pill}><IconifyIcon icon="ri:phone-line"          width={12} /> {phone}</span>}
                {hasVal(lead.email)      && <span style={pill}><IconifyIcon icon="ri:mail-line"            width={12} /> {lead.email}</span>}
                {hasVal(lead.city)       && <span style={pill}><IconifyIcon icon="ri:building-2-line"      width={12} /> {lead.city}{lead.country ? `, ${lead.country}` : ''}</span>}
                {hasVal(lead.nationality)&& <span style={pill}><IconifyIcon icon="ri:global-line"          width={12} /> {lead.nationality}</span>}
                {hasVal(lead.leadOrigin) && <span style={pill}><IconifyIcon icon="ri:share-forward-line"   width={12} /> {lead.leadOrigin}</span>}
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

        {/* ── 5. System Information ────────────────────────────────────────── */}
        {showSystem && (
          <Section title="System Information" icon="ri:information-line">
            <Row>
              <Field label="Lead ID"       value={lead.leadId ? String(lead.leadId) : null} />
              <Field label="Assign To ID"  value={lead.lead_assign_to_id ? String(lead.lead_assign_to_id) : null} />
              <Field label="Created On"    value={fmt(lead.createdAt)} />
              <Field label="Last Updated"  value={fmt(lead.updatedAt)} />
            </Row>
          </Section>
        )}

      </div>
    </div>
  );
};

export default LandlordDetails;