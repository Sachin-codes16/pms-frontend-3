import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';

const TENANT_PURPOSES = ['tenant', 'family', 'company_staff', 'bachelor', 'labour'];
const PAGE_SIZE = 10;

const useTenantsWithAssignments = () => {
  const [tenants, setTenants] = useState([]);
  const [assignmentMap, setAssignmentMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: 'application/json',
        };

        const [leadsRes, assignRes] = await Promise.all([
          httpClient.get(
            `${API_BASE_URL}/lead/get_all/?filter_key=is_active&filter_value=true&limit=999999&sort_by=leadId&sort_order=desc`,
            { headers }
          ),
          httpClient.get(
            `${API_BASE_URL}/property/assignment/get_all/?limit=999999`,
            { headers }
          ),
        ]);

        const allLeads = leadsRes.data?.data?.data || [];
        const filtered = allLeads.filter((lead) =>
          TENANT_PURPOSES.includes((lead?.purpose || '').toLowerCase())
        );

        const allAssignments = assignRes.data?.data?.data || [];
        const map = {};
        allAssignments.forEach((assignment) => {
          const tid = assignment?.tenant?.tenantId;
          if (tid != null) {
            map[tid] = (map[tid] || 0) + 1;
          }
        });

        setTenants(filtered);
        setAssignmentMap(map);
      } catch (err) {
        console.error('Fetch error:', err);
        setTenants([]);
        setAssignmentMap({});
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return { tenants, assignmentMap, loading };
};

/* ─────────────────────────────────────────────────────────────────────────────
   Individual Tenant Card
───────────────────────────────────────────────────────────────────────────── */
const TenantCard = ({ lead, assignmentMap }) => {
  const assignedCount = assignmentMap[lead?.leadId] ?? 0;
  const fullName = `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim();
  const avatar = lead?.profileImage
    ? `https://alw.checkour.work/media/${lead.profileImage}`
    : null;
  const phone = lead?.phoneNumber || lead?.phone_number || '';
  const address = [lead?.address, lead?.city, lead?.country].filter(Boolean).join(', ');
  const leadNumber = lead?.leadId || '';

  return (
    <Card>
      <CardBody>
        <div className="d-flex flex-wrap align-items-center gap-2 border-bottom pb-3">
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              className="avatar-lg rounded-3 border border-light border-3"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="avatar-lg rounded-3 border border-light border-3 d-flex align-items-center justify-content-center bg-light">
              <IconifyIcon icon="solar:user-bold-duotone" className="fs-24 text-muted" />
            </div>
          )}
          <div className="d-block overflow-hidden">
            <Link to="" className="text-dark fw-medium fs-20 text-truncate d-block">
              {fullName || 'Unknown'}
            </Link>
            [# {leadNumber}]
          </div>
        </div>

        <p className="mt-3 d-flex align-items-center gap-2 mb-2">
          <IconifyIcon icon="solar:home-bold-duotone" className="fs-18 text-primary" />
          <span>{assignedCount} Assigned Properties</span>
        </p>

        {address && (
          <p className="d-flex align-items-center gap-2 mt-2 mb-0">
            <IconifyIcon icon="solar:map-point-wave-bold-duotone" className="fs-18 text-primary" />
            {address}
          </p>
        )}
      </CardBody>

      <CardFooter className="border-top">
        <Row className="g-2">
          <Col lg={6}>
            <Button
              variant="primary"
              className="w-100"
              as="a"
              href={phone ? `tel:${phone}` : undefined}
              disabled={!phone}
            >
              <IconifyIcon icon="solar:outgoing-call-rounded-broken" className="align-middle fs-18" />{' '}
              Call Us
            </Button>
          </Col>
          <Col lg={6}>
            <Button variant="light" className="w-100">
              <IconifyIcon icon="solar:chat-round-dots-broken" className="align-middle fs-16" />{' '}
              Message
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Pagination Controls
───────────────────────────────────────────────────────────────────────────── */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis logic
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="p-3 border-top">
      <nav aria-label="Tenant pagination">
        <ul className="pagination justify-content-end mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              Previous
            </button>
          </li>

          {getPages().map((page, idx) =>
            page === '...' ? (
              <li key={`ellipsis-${idx}`} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(page)}>
                  {page}
                </button>
              </li>
            )
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main export
───────────────────────────────────────────────────────────────────────────── */
const AgentData = () => {
  const { tenants, assignmentMap, loading } = useTenantsWithAssignments();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever tenants list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tenants]);

  const totalPages = Math.ceil(tenants.length / PAGE_SIZE);
  const paginatedTenants = tenants.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) {
    return (
      <Row>
        {[1, 2, 3].map((i) => (
          <Col xl={4} lg={5} key={i}>
            <Card>
              <CardBody>
                <div className="placeholder-glow">
                  <span className="placeholder col-12 mb-2" style={{ height: 80 }} />
                  <span className="placeholder col-8" />
                  <span className="placeholder col-6" />
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (tenants.length === 0) {
    return (
      <Row>
        <Col lg={12}>
          <Card>
            <CardBody className="text-center py-5">
              <IconifyIcon icon="solar:user-bold-duotone" className="fs-1 text-muted mb-3" />
              <h5>No Tenants Found</h5>
              <p className="text-muted">No leads with tenant purposes were found in the system.</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <>
      {/* Showing info */}
      <p className="text-muted mb-3 px-1">
        Showing{' '}
        <span className="text-dark fw-semibold">
          {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, tenants.length)}
        </span>{' '}
        of <span className="text-dark fw-semibold">{tenants.length}</span> Tenants
      </p>

      <Row>
        {paginatedTenants.map((lead, idx) => (
          <Col xl={4} lg={5} key={lead?.leadId || idx}>
            <TenantCard lead={lead} assignmentMap={assignmentMap} />
          </Col>
        ))}
      </Row>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default AgentData;