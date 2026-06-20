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
import * as XLSX from 'xlsx'; // Add this import

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

const TENANT_PURPOSES = ['tenant'];
const LANDLORD_PURPOSES = ['landlord'];
const LANDLORD_PAGE_SIZE = 10;
const TENANT_PAGE_SIZE = 10;


const LeadList = ({ purposeFilter, onCountChange, searchQuery }) => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For landlord: fetch a large batch and paginate frontend-side
  const [allLandlordLeads, setAllLandlordLeads] = useState([]);
  const [landlordPage, setLandlordPage] = useState(1);

  // For tenant: fetch a large batch and paginate frontend-side
  const [allTenantLeads, setAllTenantLeads] = useState([]);
  const [tenantPage, setTenantPage] = useState(1);

  const [params, setParams] = useState({
    filter_key: 'isActive',
    filter_value: 'True',
    limit: (purposeFilter === 'landlord' || purposeFilter === 'tenant') ? 1000 : 10,
    sort_by: 'leadId',
    sort_order: 'desc',
    page_num: 1,
  });

  const [openCommentId, setOpenCommentId] = useState(null);
  const [comment, setComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // Get logged-in manager info from localStorage/cookie
  const getLoggedInManager = () => {
    try {
      const userDataStr = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        return {
          userId: userData.userId || userData.id || 0,
          name: userData.name || userData.username || 'Unknown',
          phoneNumber: userData.phoneNumber || userData.phone || '',
          department: userData.department || 'Marketing'
        };
      }
    } catch (e) {
      console.error('Error getting logged-in manager:', e);
    }
    
    return {
      userId: 0,
      name: 'System User',
      phoneNumber: '',
      department: 'Marketing'
    };
  };

  // Excel Export Function
  const exportToExcel = () => {
    try {
      // Get the data to export based on current filter
      let dataToExport = [];
      
      if (purposeFilter === 'landlord') {
        dataToExport = filterLeadsBySearch(allLandlordLeads, searchQuery);
      } else if (purposeFilter === 'tenant') {
        dataToExport = filterLeadsBySearch(allTenantLeads, searchQuery);
      } else {
        dataToExport = filterLeadsBySearch(rawLeads, searchQuery);
      }

      // Format data for Excel
      const excelData = dataToExport.map((lead, index) => ({
        'Sr.No': index + 1,
        'Lead ID': lead.leadId || '',
        'Name': [lead.firstName, lead.lastName].filter(Boolean).join(' ') || '',
        'Address': lead.address || '',
        'Contact': lead.phone_number || lead.phoneNumber || '',
        'Assigned To': lead.leadAssignTo?.name || '',
        'Origin': lead.leadOrigin || '',
        'Created': formatDate(lead.createdAt),
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 10 },  // Lead ID
        { wch: 25 },  // Name
        { wch: 30 },  // Address
        { wch: 15 },  // Contact
        { wch: 20 },  // Assigned To
        { wch: 15 },  // Origin
        { wch: 15 },  // Created
        { wch: 10 },  // Status
      ];
      worksheet['!cols'] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Determine sheet name based on filter
      const sheetName = purposeFilter === 'tenant' 
        ? 'Tenants List' 
        : purposeFilter === 'landlord' 
          ? 'Landlord List' 
          : 'All Leads';
      
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; 
      const fileName = `${sheetName.replace(/ /g, '_')}_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      // console.log('Excel file exported successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data to Excel. Please try again.');
    }
  };

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

  // When data loads for tenant, filter by TENANT_PURPOSES only
  useEffect(() => {
    if (purposeFilter === 'tenant' && data?.data) {
      const filtered = data.data.filter((l) =>
        TENANT_PURPOSES.includes(String(l.purpose || '').toLowerCase())
      );
      setAllTenantLeads(filtered);
      setTenantPage(1);
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

  // Filter function for search
  const filterLeadsBySearch = (leads, query) => {
    if (!query || query.trim() === '') return leads;
    
    const searchLower = query.toLowerCase().trim();
    
    return leads.filter((lead) => {
      const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(' ').toLowerCase();
      const address = (lead.address || '').toLowerCase();
      const contact = (lead.phone_number || lead.phoneNumber || '').toLowerCase();
      const leadId = String(lead.leadId || '').toLowerCase();
      const purpose = (lead.purpose || '').toLowerCase();
      const assignedTo = (lead.leadAssignTo?.name || '').toLowerCase();
      const origin = (lead.leadOrigin || '').toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        address.includes(searchLower) ||
        contact.includes(searchLower) ||
        leadId.includes(searchLower) ||
        purpose.includes(searchLower) ||
        assignedTo.includes(searchLower) ||
        origin.includes(searchLower)
      );
    });
  };

  // ── Leads + pagination logic ────────────────────────────────────────────────
  let leads = [];
  let presentPage = 1;
  let totalPage = 0;
  let totalCount = 0;

  if (purposeFilter === 'landlord') {
    // Filter by search query
    const searchFiltered = filterLeadsBySearch(allLandlordLeads, searchQuery);
    totalCount = searchFiltered.length;
    
    // Frontend pagination over filtered landlord leads
    totalPage = Math.ceil(totalCount / LANDLORD_PAGE_SIZE) || 0;
    presentPage = landlordPage;
    const start = (landlordPage - 1) * LANDLORD_PAGE_SIZE;
    leads = searchFiltered.slice(start, start + LANDLORD_PAGE_SIZE);
  } else if (purposeFilter === 'tenant') {
    // Filter by search query
    const searchFiltered = filterLeadsBySearch(allTenantLeads, searchQuery);
    totalCount = searchFiltered.length;
    
    // Frontend pagination over filtered tenant leads
    totalPage = Math.ceil(totalCount / TENANT_PAGE_SIZE) || 0;
    presentPage = tenantPage;
    const start = (tenantPage - 1) * TENANT_PAGE_SIZE;
    leads = searchFiltered.slice(start, start + TENANT_PAGE_SIZE);
  } else {
    const searchFiltered = filterLeadsBySearch(rawLeads, searchQuery);
    totalCount = searchFiltered.length;
    
    leads = searchFiltered;
    presentPage = data?.presentPage ?? 1;
    totalPage = data?.totalPage ?? 0;
  }

  // Update parent component with count
  useEffect(() => {
    if (onCountChange) {
      onCountChange(totalCount);
    }
  }, [totalCount, onCountChange]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (purposeFilter === 'landlord') {
      setLandlordPage(1);
    } else if (purposeFilter === 'tenant') {
      setTenantPage(1);
    } else {
      setParams((p) => ({ ...p, page_num: 1 }));
    }
  }, [searchQuery, purposeFilter]);
  // ────────────────────────────────────────────────────────────────────────────

  const goToPage = (page) => {
    if (purposeFilter === 'landlord') {
      const next = Math.max(1, Math.min(page, totalPage || 1));
      setLandlordPage(next);
    } else if (purposeFilter === 'tenant') {
      const next = Math.max(1, Math.min(page, totalPage || 1));
      setTenantPage(next);
    } else {
      const next = Math.max(1, Math.min(page, totalPage || 1));
      setParams((p) => ({ ...p, page_num: next }));
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const handleCommentSubmit = async (lead) => {
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setCommentSubmitting(true);
    
    try {
      const leadId = lead.leadId ?? lead.lead_id;
      const leadPurpose = String(lead.purpose || '').toLowerCase();
      
      let targetType = 'tenant';
      if (LANDLORD_PURPOSES.includes(leadPurpose)) {
        targetType = 'landlord';
      } else if (TENANT_PURPOSES.includes(leadPurpose)) {
        targetType = 'tenant';
      }

      const manager = getLoggedInManager();

      const payload = {
        targetType: targetType,
        targetId: leadId,
        content: comment.trim(),
        createdBy: {
          userId: manager.userId,
          name: manager.name,
          phoneNumber: manager.phoneNumber,
          department: manager.department
        },
        createdAt: new Date().toISOString()
      };

      // console.log('Submitting comment:', payload);

      const response = await httpClient.post(
        `${API_BASE_URL}/marketing/comment/create/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      // console.log('Comment saved successfully:', response.data);
      
      alert('Comment added successfully!');
      
      setComment('');
      setOpenCommentId(null);
      
    } catch (e) {
      console.error('Error saving comment:', e);
      const errorMsg = e?.response?.data?.message || e?.message || 'Failed to save comment';
      alert(`Error: ${errorMsg}`);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const colSpan = 11; 

  return (
    <Row>
      <Col xl={12}>
        <Card>
        <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
  <CardTitle as="h4">
    {purposeFilter === 'tenant'
      ? `Tenants List (${totalCount})`
      : purposeFilter === 'landlord'
        ? `Landlord List (${totalCount})`
        : `All Leads List (${totalCount})`}
  </CardTitle>

  {/* Dropdown ki jagah ab sirf ye button dikhega */}
  <button 
    onClick={exportToExcel} 
    className="btn btn-sm btn-outline-success d-flex align-items-center"
  >
    <IconifyIcon icon="ri:file-excel-2-line" className="me-1" width={16} height={16} />
    Export to Excel
  </button>
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
                    <th>Sr.No</th>
                      <th>Lead ID</th>
                      <th>Name</th>
                      <th style={{ width: '130px' }}>Address</th>
                      <th>Contact</th>
                      <th>Assigned To</th>
                      <th>Origin</th>
                      <th>Estimated C.Date</th>
                      <th>Comment</th>
                      <th>Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={colSpan} className="text-center text-muted py-4">
                          {searchQuery ? 'No leads found matching your search.' : 'No leads found.'}
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead, index) => (
                        <tr key={lead.leadId}>
                          <td className="fw-medium text-muted">
  {purposeFilter === 'landlord'
    ? (landlordPage - 1) * LANDLORD_PAGE_SIZE + index + 1
    : purposeFilter === 'tenant'
      ? (tenantPage - 1) * TENANT_PAGE_SIZE + index + 1
      : (presentPage - 1) * params.limit + index + 1}
</td>
                          <td className="fw-medium text-muted">{lead.leadId}</td>
                          <td>
                            <div
                              className="d-flex align-items-center gap-2"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                const purpose = lead.purpose?.toLowerCase();
                                const leadId  = lead.leadId ?? lead.lead_id;
                              
                                if (purpose === 'tenant' || TENANT_PURPOSES.includes(purpose)) {
                                  navigate('/tenant-details', { state: { leadId } });
                                } else if (LANDLORD_PURPOSES.includes(purpose)) {
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
                           {/* Estimated Closing Date */}
                           <td>{formatDate(lead.updatedAt)}</td>

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
                                        if (e.key === 'Enter' && !commentSubmitting) {
                                          handleCommentSubmit(lead);
                                        }
                                      }}
                                      placeholder="Comment"
                                      className="form-control form-control-sm border-0 shadow-none"
                                      style={{ fontSize: '13px' }}
                                      autoFocus
                                      disabled={commentSubmitting}
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
                                      disabled={commentSubmitting}
                                    >
                                      {commentSubmitting ? (
                                        <Spinner animation="border" size="sm" />
                                      ) : (
                                        '↑'
                                      )}
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
  onClick={() => navigate('/Assignment-property', { 
    state: { lead: lead } 
  })}
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
                                title="History"
                                onClick={() => {
                                  const leadPurpose = String(lead.purpose || '').toLowerCase();
                                  const targetType = LANDLORD_PURPOSES.includes(leadPurpose) ? 'landlord' : 'tenant';
                                  
                                  navigate('/comment', { 
                                    state: { 
                                      leadId: lead.leadId || lead.lead_id,
                                      targetType: targetType
                                    } 
                                  });
                                }}
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

          {!loading && !error && totalPage > 1 && (
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