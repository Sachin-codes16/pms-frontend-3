import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Icon as IconifyIcon } from '@iconify/react';

const buildGetAllUrl = (params) => {
  const search = new URLSearchParams();
  if (params.filter_key != null) search.set('filter_key', params.filter_key);
  if (params.filter_value != null) search.set('filter_value', params.filter_value);
  if (params.limit != null) search.set('limit', String(params.limit));
  if (params.page_num != null) search.set('page_num', String(params.page_num));
  if (params.sort_by != null) search.set('sort_by', params.sort_by);
  if (params.sort_order != null) search.set('sort_order', params.sort_order);
  if (params.search_key != null) search.set('search_key', params.search_key);
  if (params.value != null) search.set('value', params.value);
  if (params.from_date != null) search.set('from_date', params.from_date);
  if (params.to_date != null) search.set('to_date', params.to_date);
  if (params.purpose != null) search.set('purpose', params.purpose);
  const qs = search.toString();
  return `${API_BASE_URL}/lead/get_all/${qs ? `?${qs}` : ''}`;
};

const TENANT_PURPOSES = ['tenant', 'family', 'company_staff', 'bachelor', 'labour'];
const LANDLORD_PURPOSES = ['landlord', 'owner', 'company'];
const LANDLORD_PAGE_SIZE = 10;


const LeadList = ({ purposeFilter }) => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For landlord: fetch a large batch and paginate frontend-side
  const [allLandlordLeads, setAllLandlordLeads] = useState([]);
  const [landlordPage, setLandlordPage] = useState(1);

  const [params, setParams] = useState({
    filter_key: 'is_active',
    filter_value: 'true',
    // Fetch large limit for landlord so we can filter all records frontend-side
    limit: purposeFilter === 'landlord' ? 1000 : 10,
    sort_by: 'name',
    page_num: 1,
    ...(purposeFilter === 'tenant' ? { purpose: purposeFilter } : {}),
  });

  const [openCommentId, setOpenCommentId] = useState(null);
  const [comment, setComment] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = buildGetAllUrl(params);
      const res = await httpClient.get(url, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: 'application/json',
        },
      });
      if (res.data?.status && res.data?.data) {
        setData(res.data.data);
      } else {
        setData({ data: [], presentPage: 1, totalPage: 0 });
      }
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load leads');
      setData({ data: [], presentPage: 1, totalPage: 0 });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // When data loads for landlord, filter by LANDLORD_PURPOSES only
  useEffect(() => {
    if (purposeFilter === 'landlord' && data?.data) {
      const filtered = data.data.filter((l) =>
        LANDLORD_PURPOSES.includes(String(l.purpose || '').toLowerCase())
      );
      setAllLandlordLeads(filtered);
      setLandlordPage(1);
    }
  }, [data, purposeFilter]);

  useEffect(() => {
    if (openCommentId === null) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.comment-popup') && !e.target.closest('.add-comment-link')) {
        setOpenCommentId(null);
        setComment('');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [openCommentId]);

  const rawLeads = data?.data ?? [];

  // ── Leads + pagination logic ────────────────────────────────────────────────
  let leads = [];
  let presentPage = 1;
  let totalPage = 0;

  if (purposeFilter === 'landlord') {
    // Frontend pagination over filtered landlord leads
    const totalFiltered = allLandlordLeads.length;
    totalPage = Math.ceil(totalFiltered / LANDLORD_PAGE_SIZE) || 0;
    presentPage = landlordPage;
    const start = (landlordPage - 1) * LANDLORD_PAGE_SIZE;
    leads = allLandlordLeads.slice(start, start + LANDLORD_PAGE_SIZE);
  } else if (purposeFilter === 'tenant') {
    leads = rawLeads.filter((l) =>
      TENANT_PURPOSES.includes(String(l.purpose || '').toLowerCase())
    );
    presentPage = data?.presentPage ?? 1;
    totalPage = data?.totalPage ?? 0;
  } else {
    leads = rawLeads;
    presentPage = data?.presentPage ?? 1;
    totalPage = data?.totalPage ?? 0;
  }
  // ────────────────────────────────────────────────────────────────────────────

  const goToPage = (page) => {
    if (purposeFilter === 'landlord') {
      const next = Math.max(1, Math.min(page, totalPage || 1));
      setLandlordPage(next);
    } else {
      const next = Math.max(1, Math.min(page, totalPage || 1));
      setParams((p) => ({ ...p, page_num: next }));
    }
  };

  const handleDeleteLead = useCallback(
    async (lead) => {
      const leadId = lead.leadId ?? lead.lead_id;
      const name =
        [lead.firstName, lead.lastName].filter(Boolean).join(' ') ||
        (leadId ? `Lead #${leadId}` : 'this lead');
      if (!leadId) {
        alert('Cannot delete this lead because its ID is missing from the server response.');
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      );
      if (!confirmed) return;

      try {
        await httpClient.delete(`${API_BASE_URL}/lead/delete/?lead_id=${leadId}`, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
        });
        fetchLeads();
      } catch (e) {
        const raw = e?.response?.data;
        let msg =
          (raw && typeof raw === 'string' && raw) ||
          (raw && typeof raw.message === 'string' && raw.message) ||
          e?.message ||
          'Failed to delete lead';

        if (
          msg.includes('Cannot delete some instances of model') ||
          msg.includes('protected foreign keys')
        ) {
          msg = 'This lead cannot be deleted because it is linked to one or more properties.';
        } else if (msg.includes('has no lead_id')) {
          msg =
            'The server reported that the lead has no ID. Try refreshing the list and attempting again.';
        }

        alert(msg);
      }
    },
    [fetchLeads]
  );

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const handleCommentSubmit = (lead) => {
    console.log('Saved Comment for lead:', lead.leadId, '| Comment:', comment);
    setComment('');
    setOpenCommentId(null);
  };

  const colSpan = purposeFilter === 'landlord' ? 10 : 11;

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
          <CardTitle as="h4">
  {purposeFilter === 'tenant'
    ? `Tenants List (${rawLeads.length})`
    : purposeFilter === 'landlord'
      ? `Landlord List (${allLandlordLeads.length})`
      : `All Leads List (${rawLeads.length})`}
</CardTitle>
            <Dropdown>
              <DropdownToggle
                as="a"
                className="btn btn-sm btn-outline-light rounded content-none icons-center"
                href="#"
              >
                This Month
                <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>

          <CardBody className="p-0">
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : error ? (
              <div className="text-center py-5 text-danger">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th>Lead ID</th>
                      <th>Name</th>
                      <th style={{ width: '130px' }}>Address</th>
                      <th>Contact</th>
                      <th>Assigned To</th>
                      <th>Origin</th>
                      {/* Purpose column hidden for landlord view */}
                      {purposeFilter !== 'landlord' && <th>Purpose</th>}
                      <th>Created</th>
                      <th>Status</th>
                      <th>Comment</th>
                      <th>Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={colSpan} className="text-center text-muted py-4">
                          No leads found.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.leadId}>
                          <td className="fw-medium text-muted">{lead.leadId}</td>
                          <td>
                            <div
                              className="d-flex align-items-center gap-2"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const purpose = lead.purpose?.toLowerCase();
                                const leadId  = lead.leadId ?? lead.lead_id;
 
                                if (purpose === 'tenant') {
                                  navigate('/Customers-Details', { state: { user: lead } });
                                } else if (LANDLORD_PURPOSES.includes(purpose)) {
                                  // ✅ Pass leadId — details page fetches fresh data itself
                                  navigate('/landlord-details', { state: { leadId } });
                                }
                              }}
                            >
                              <span
                                className="fw-medium"
                                style={{ color: '#3b82f6', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                              >
                                {[lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—'}
                              </span>
                            </div>
                          </td>
                          <td
                            style={{
                              maxWidth: '130px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={lead.address || ''}
                          >
                            {lead.address || '—'}
                          </td>
                          <td>{lead.phone_number ?? lead.phoneNumber ?? '—'}</td>
                          <td>
                            <span className="fw-medium">{lead.leadAssignTo?.name ?? '—'}</span>
                          </td>
                          <td>{lead.leadOrigin ?? '—'}</td>
                          {/* Purpose cell hidden for landlord view */}
                          {purposeFilter !== 'landlord' && (
                            <td>{lead.purpose ?? '—'}</td>
                          )}
                          <td>{formatDate(lead.createdAt)}</td>
                          <td>
                            <span
                              className={`badge bg-${
                                lead.isActive ? 'success' : 'danger'
                              }-subtle text-${lead.isActive ? 'success' : 'danger'} px-3 py-1`}
                            >
                              {lead.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td style={{ position: 'relative', overflow: 'visible' }}>
                            <Link
                              to=""
                              className="text-primary text-decoration-underline add-comment-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setComment('');
                                setOpenCommentId(
                                  openCommentId === lead.leadId ? null : lead.leadId
                                );
                              }}
                            >
                              Add Comment
                            </Link>

                            {openCommentId === lead.leadId && (
                              <div
                                className="comment-popup"
                                style={{
                                  position: 'fixed',
                                  top: '46%',
                                  left: '70%',
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 9999,
                                  background: '#e0e0e0',
                                  padding: '22px 16px',
                                  borderRadius: '30px',
                                  width: '550px',
                                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '12px',
                                  }}
                                >
                                  <span style={{ fontSize: '14px', fontWeight: 800 }}>
                                    Add Comment
                                  </span>
                                  <span style={{ fontSize: '12px', color: '#555', fontWeight: 700 }}>
                                    {[lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—'}{' '}
                                    |{' '}
                                    {new Date().toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })}{' '}
                                    |{' '}
                                    {new Date().toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <img
                                    src={avatar1}
                                    alt="user"
                                    width="36"
                                    height="36"
                                    className="rounded-circle"
                                    style={{ border: '2px solid #fff', flexShrink: 0 }}
                                  />
                                  <div
                                    style={{
                                      flex: 1,
                                      background: '#fff',
                                      borderRadius: '20px',
                                      padding: '6px 10px',
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <input
                                      type="text"
                                      value={comment}
                                      onChange={(e) => setComment(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCommentSubmit(lead);
                                      }}
                                      placeholder="Comment"
                                      className="form-control form-control-sm border-0 shadow-none"
                                      style={{ fontSize: '13px' }}
                                      autoFocus
                                    />
                                    <button
                                      className="btn btn-primary btn-sm rounded-circle"
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        padding: 0,
                                        marginLeft: '6px',
                                        flexShrink: 0,
                                      }}
                                      onClick={() => handleCommentSubmit(lead)}
                                    >
                                      ↑
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>

                          <td>
                            <div className="d-flex gap-2">
                              {purposeFilter === 'tenant' && (
                                <button
                                  onClick={() => navigate('/Assignment-property')}
                                  style={{
                                    backgroundColor: '#4a6fa5',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  Assign Property
                                </button>
                              )}
                              <Button
                                variant="light"
                                size="sm"
                                title="View details"
                                onClick={() => navigate('/lead/preview', { state: { lead } })}
                              >
                                <IconifyIcon icon="solar:eye-broken" />
                              </Button>
                              <Button
                                variant="soft-primary"
                                size="sm"
                                title="Edit"
                                onClick={() => navigate('/lead/edit', { state: { lead } })}
                              >
                                <IconifyIcon icon="solar:pen-2-broken" />
                              </Button>
                              <Button
                                variant="light"
                                size="sm"
                                title="Delete"
                                className="text-danger"
                                onClick={() => handleDeleteLead(lead)}
                              >
                                <IconifyIcon icon="solar:trash-bin-2-broken" />
                              </Button>
                              <Button
                                variant="light"
                                size="sm"
                                title="History"
                                onClick={() => navigate('/comment')}
                              >
                                <IconifyIcon icon="ri:time-line" width={18} height={18} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>

          {!loading && !error && totalPage > 0 && (
            <CardFooter>
              <nav>
                <ul className="pagination justify-content-end mb-0">
                  <li className={`page-item ${presentPage <= 1 ? 'disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => goToPage(presentPage - 1)}
                      disabled={presentPage <= 1}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${presentPage === page ? 'active' : ''}`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${presentPage >= totalPage ? 'disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => goToPage(presentPage + 1)}
                      disabled={presentPage >= totalPage}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </CardFooter>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default LeadList;

