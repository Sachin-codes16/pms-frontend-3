import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import avatar1 from '@/assets/images/users/avatar-1.jpg';


import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
    Col,
    Row,
    Spinner,
} from 'react-bootstrap';
import { Icon as IconifyIcon } from '@iconify/react';
import * as XLSX from 'xlsx';

const PAGE_SIZE = 10;

const TENANT_PURPOSES = ['tenant'];
const LANDLORD_PURPOSES = ['landlord'];

const buildGetAllUrl = (params) => {
    const search = new URLSearchParams();
    if (params.filter_key != null) search.set('filter_key', params.filter_key);
    if (params.filter_value != null) search.set('filter_value', params.filter_value);
    if (params.limit != null) search.set('limit', String(params.limit));
    if (params.page_num != null) search.set('page_num', String(params.page_num));
    if (params.sort_by != null) search.set('sort_by', params.sort_by);
    if (params.sort_order != null) search.set('sort_order', params.sort_order);
    const qs = search.toString();
    return `${API_BASE_URL}/lead/get_all/${qs ? `?${qs}` : ''}`;
};

const formatDate = (iso) => {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
        });
    } catch { return iso; }
};

const getPurposeLabel = (purpose) => {
    if (TENANT_PURPOSES.includes(purpose)) return 'Tenant';
    if (LANDLORD_PURPOSES.includes(purpose)) return 'Landlord';
    return purpose;
};

const getPurposeBadgeColor = (purpose) => {
    const p = (purpose || '').toLowerCase();
    if (LANDLORD_PURPOSES.includes(p)) return { bg: '#dbeafe', color: '#1d4ed8' };
    if (TENANT_PURPOSES.includes(p)) return { bg: '#dcfce7', color: '#15803d' };
    return { bg: '#f3f4f6', color: '#374151' };
};

const getLoggedInManager = () => {
    try {
        const raw = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
        if (raw) {
            const u = JSON.parse(raw);
            return {
                userId: u.userId || u.id || 0,
                name: u.name || u.username || 'Unknown',
                phoneNumber: u.phoneNumber || u.phone || '',
                department: u.department || 'Marketing',
            };
        }
    } catch { }
    return { userId: 0, name: 'System User', phoneNumber: '', department: 'Marketing' };
};

// ─────────────────────────────────────────────────────────────────────────────

const TotalLeadList = ({ searchQuery = '' }) => {
    const navigate = useNavigate();

    const [allLeads, setAllLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [activeTab, setActiveTab] = useState('all');

    const [openCommentId, setOpenCommentId] = useState(null);
    const [comment, setComment] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    const [convertModal, setConvertModal] = useState({ show: false, lead: null });
    const [converting, setConverting] = useState(false);

    // ── Fetch ALL leads once ────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const url = buildGetAllUrl({
                filter_key: 'isActive',
                filter_value: 'False',
                limit: 999999,
                sort_by: 'leadId',
                sort_order: 'desc',
                page_num: 1,
            });
            const res = await httpClient.get(url, {
                headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' },
            });
            if (res.data?.status && res.data?.data?.data) {
                setAllLeads(res.data.data.data);
            } else {
                setAllLeads([]);
            }
        } catch (e) {
            setError(e?.response?.data?.message || e?.message || 'Failed to load leads');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // ── Outside-click to close comment popup ───────────────────────────────────
    useEffect(() => {
        if (openCommentId === null) return;
        const handler = (e) => {
            if (!e.target.closest('.comment-popup') && !e.target.closest('.add-comment-link')) {
                setOpenCommentId(null);
                setComment('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [openCommentId]);

    // ── Filter + search ─────────────────────────────────────────────────────────
    const tabFiltered = allLeads.filter((lead) => {
        const p = (lead.purpose || '').toLowerCase();
        if (activeTab === 'landlord') return LANDLORD_PURPOSES.includes(p);
        if (activeTab === 'tenant') return TENANT_PURPOSES.includes(p);
        return true;
    });

    const searchFiltered = (() => {
        if (!searchQuery.trim()) return tabFiltered;
        const q = searchQuery.toLowerCase().trim();
        return tabFiltered.filter((lead) => {
            const name = [lead.firstName, lead.lastName].filter(Boolean).join(' ').toLowerCase();
            const address = (lead.address || '').toLowerCase();
            const contact = (lead.phoneNumber || lead.phone_number || '').toLowerCase();
            const id = String(lead.leadId || '').toLowerCase();
            const purpose = (lead.purpose || '').toLowerCase();
            const assigned = (lead.leadAssignTo?.name || '').toLowerCase();
            const origin = (lead.leadOrigin || '').toLowerCase();
            return name.includes(q) || address.includes(q) || contact.includes(q) ||
                id.includes(q) || purpose.includes(q) || assigned.includes(q) || origin.includes(q);
        });
    })();

    useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

    const totalCount = searchFiltered.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 0;
    const pageLeads = searchFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const goToPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages || 1)));

    const landlordCount = allLeads.filter(l => LANDLORD_PURPOSES.includes((l.purpose || '').toLowerCase())).length;
    const tenantCount = allLeads.filter(l => TENANT_PURPOSES.includes((l.purpose || '').toLowerCase())).length;

    // ── Comment submit ─────────────────────────────────────────────────────────
    const handleCommentSubmit = async (lead) => {
        if (!comment.trim()) { alert('Please enter a comment'); return; }
        setCommentSubmitting(true);
        try {
            const p = (lead.purpose || '').toLowerCase();
            const targetType = LANDLORD_PURPOSES.includes(p) ? 'landlord' : 'tenant';
            const manager = getLoggedInManager();
            await httpClient.post(
                `${API_BASE_URL}/marketing/comment/create/`,
                {
                    targetType,
                    targetId: lead.leadId ?? lead.lead_id,
                    content: comment.trim(),
                    createdBy: manager,
                    createdAt: new Date().toISOString(),
                },
                { headers: { Authorization: `Bearer ${AUTH_TOKEN}`, 'Content-Type': 'application/json' } }
            );
            alert('Comment added successfully!');
            setComment('');
            setOpenCommentId(null);
        } catch (e) {
            alert(`Error: ${e?.response?.data?.message || e?.message || 'Failed to save comment'}`);
        } finally {
            setCommentSubmitting(false);
        }
    };

    // ── Convert lead ────────────────────────────────────────────────────────────
    const handleConvert = async () => {
        const lead = convertModal.lead;
        if (!lead) return;
    
        const leadId = lead.leadId ?? lead.lead_id;
        const body = {
            lead_id: leadId,
            leadId: leadId,
            is_active: true,
            isActive: true,
        };
    
        // ✅ Define headers properly
        const headers = {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json'
        };
    
        setConverting(true);
    
        console.group('%c📤 Convert Request', 'color: #604ae3; font-weight: bold;');
        console.log('URL     :', `${API_BASE_URL}/lead/update/`);
        console.log('Headers :', headers);  // ✅ Now it works!
        console.log('Body    :', JSON.stringify(body, null, 2));
        console.groupEnd();
    
        try {
            const response = await httpClient.put(
                `${API_BASE_URL}/lead/update/`,
                body,
                { headers }  // ✅ Use the headers variable
            );
    
            console.group('%c✅ Convert Response — SUCCESS', 'color: green; font-weight: bold;');
            console.log('Status  :', response.status);
            console.log('Data    :', response.data);
            console.groupEnd();
    
            setAllLeads((prev) =>
                prev.filter((l) => (l.leadId ?? l.lead_id) !== leadId)
            );
            setConvertModal({ show: false, lead: null });
            alert('Lead converted successfully!');
    
        } catch (err) {
            console.group('%c❌ Convert Response — FAILED', 'color: red; font-weight: bold;');
            console.log('HTTP Status   :', err?.response?.status);
            console.log('Response Data :', err?.response?.data);
            console.log('Error Message :', err?.response?.data?.message || err?.message);
            console.groupEnd();
    
            const errMsg = err?.response?.data?.message || err?.message || 'Unknown error';
            alert(`Convert failed! Error: ${errMsg}`);
        } finally {
            setConverting(false);
        }
    };

    // ── Excel export ───────────────────────────────────────────────────────────
    const exportToExcel = () => {
        try {
            const excelData = searchFiltered.map((lead, index) => ({
                'Sr.No': index + 1,
                'Lead ID': lead.leadId || '',
                'Name': [lead.firstName, lead.lastName].filter(Boolean).join(' ') || '',
                'Type': getPurposeLabel(lead.purpose),
                'Address': lead.address || '',
                'Contact': lead.phoneNumber || lead.phone_number || '',
                'Assigned To': lead.leadAssignTo?.name || '',
                'Origin': lead.leadOrigin || '',
                'Country': lead.country || '',
                'City': lead.city || '',
                'Estimated C.Date': formatDate(lead.updatedAt),
                'Status': lead.isActive ? 'Active' : 'Inactive',
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            worksheet['!cols'] = [
                { wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 30 },
                { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
                { wch: 15 }, { wch: 15 }, { wch: 10 },
            ];
            const workbook = XLSX.utils.book_new();
            const sheetName =
                activeTab === 'tenant' ? 'Tenants List' :
                    activeTab === 'landlord' ? 'Landlord List' : 'All Leads';
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            const dateStr = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `${sheetName.replace(/ /g, '_')}_${dateStr}.xlsx`);
        } catch (err) {
            console.error('Export error:', err);
            alert('Failed to export. Please try again.');
        }
    };

    // ── Tab button style helper ─────────────────────────────────────────────────
    const tabStyle = (tab) => ({
        padding: '6px 18px',
        borderRadius: '20px',
        border: 'none',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: activeTab === tab ? '#604ae3' : '#f1f1f5',
        color: activeTab === tab ? '#fff' : '#555',
    });

    // ────────────────────────────────────────────────────────────────────────────
    return (
        <>
            <Row>
                <Col xl={12}>
                    <Card>
                        {/* ── Header ───────────────────────────────────────────────────────── */}
                        <CardHeader className="d-flex flex-wrap justify-content-between align-items-center gap-2 border-bottom">
                            <CardTitle as="h4" className="mb-0">
                                New Lead List&nbsp;
                                <span style={{ color: '#604ae3' }}>({totalCount})</span>
                            </CardTitle>

                            <div className="d-flex gap-2 flex-wrap" style={{ marginLeft: 'auto' }}>
                                <button style={tabStyle('all')} onClick={() => setActiveTab('all')}>
                                    All ({allLeads.length})
                                </button>
                                <button style={tabStyle('landlord')} onClick={() => setActiveTab('landlord')}>
                                    Landlord ({landlordCount})
                                </button>
                                <button style={tabStyle('tenant')} onClick={() => setActiveTab('tenant')}>
                                    Tenant ({tenantCount})
                                </button>
                            </div>

                            <button
                                onClick={exportToExcel}
                                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                            >
                                <IconifyIcon icon="ri:file-excel-2-line" width={16} height={16} />
                                Export to Excel
                            </button>
                        </CardHeader>

                        {/* ── Body ─────────────────────────────────────────────────────────── */}
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
                                                <th>Type</th>
                                                <th style={{ width: '130px' }}>Address</th>
                                                <th>Contact</th>
                                                <th>Assigned To</th>
                                                <th>Origin</th>
                                                <th>Estimated C.Date</th>
                                                <th>Status</th>
                                                <th>Comment</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageLeads.length === 0 ? (
                                                <tr>
                                                    <td colSpan={13} className="text-center text-muted py-4">
                                                        {searchQuery ? 'No leads found matching your search.' : 'No leads found.'}
                                                    </td>
                                                </tr>
                                            ) : (
                                                pageLeads.map((lead, index) => {
                                                    const purposeLower = (lead.purpose || '').toLowerCase();
                                                    const badgeStyle = getPurposeBadgeColor(lead.purpose);
                                                    const isLandlord = LANDLORD_PURPOSES.includes(purposeLower);
                                                    const isTenant = TENANT_PURPOSES.includes(purposeLower);

                                                    return (
                                                        <tr key={lead.leadId}>

                                                            <td className="fw-medium text-muted">
                                                                {(currentPage - 1) * PAGE_SIZE + index + 1}
                                                            </td>
                                                            <td className="fw-medium text-muted">{lead.leadId}</td>

                                                            <td>
                                                                <span
                                                                    style={{
                                                                        color: '#3b82f6',
                                                                        textDecoration: 'underline',
                                                                        textUnderlineOffset: '2px',
                                                                        cursor: 'pointer',
                                                                        fontWeight: '500',
                                                                    }}
                                                                    onClick={() => {
                                                                        const id = lead.leadId ?? lead.lead_id;
                                                                        if (isTenant) navigate('/tenant-details', { state: { leadId: id } });
                                                                        else if (isLandlord) navigate('/landlord-details', { state: { leadId: id } });
                                                                    }}
                                                                >
                                                                    {[lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—'}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <span
                                                                    style={{
                                                                        backgroundColor: badgeStyle.bg,
                                                                        color: badgeStyle.color,
                                                                        borderRadius: '12px',
                                                                        padding: '3px 10px',
                                                                        fontSize: '12px',
                                                                        fontWeight: '600',
                                                                    }}
                                                                >
                                                                    {getPurposeLabel(lead.purpose)}
                                                                </span>
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

                                                            <td>{lead.phoneNumber ?? lead.phone_number ?? '—'}</td>

                                                            <td>
                                                                <span className="fw-medium">{lead.leadAssignTo?.name ?? '—'}</span>
                                                            </td>

                                                            <td>{lead.leadOrigin ?? '—'}</td>

                                                            <td>{formatDate(lead.updatedAt)}</td>

                                                            <td>
                                                                <button
                                                                    title="Convert this lead"
                                                                    onClick={() => setConvertModal({ show: true, lead })}
                                                                    style={{
                                                                        fontSize: '11px',
                                                                        fontWeight: '600',
                                                                        padding: '4px 12px',
                                                                        borderRadius: '10px',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        backgroundColor: '#604ae3',
                                                                        color: '#fff',
                                                                        transition: 'all 0.2s',
                                                                        whiteSpace: 'nowrap',
                                                                    }}
                                                                >
                                                                    Convert
                                                                </button>
                                                            </td>

                                                            <td style={{ position: 'relative', overflow: 'visible' }}>
                                                                <Link
                                                                    to=""
                                                                    className="text-primary text-decoration-underline add-comment-link"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        setComment('');
                                                                        setOpenCommentId(openCommentId === lead.leadId ? null : lead.leadId);
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
                                                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                                                            <span style={{ fontSize: '14px', fontWeight: 800 }}>Add Comment</span>
                                                                            <span style={{ fontSize: '12px', color: '#555', fontWeight: 700 }}>
                                                                                {[lead.firstName, lead.lastName].filter(Boolean).join(' ') || '—'}
                                                                                {' | '}
                                                                                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                                {' | '}
                                                                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                                                                        if (e.key === 'Enter' && !commentSubmitting) handleCommentSubmit(lead);
                                                                                    }}
                                                                                    placeholder="Comment"
                                                                                    className="form-control form-control-sm border-0 shadow-none"
                                                                                    style={{ fontSize: '13px' }}
                                                                                    autoFocus
                                                                                    disabled={commentSubmitting}
                                                                                />
                                                                                <button
                                                                                    className="btn btn-primary btn-sm rounded-circle"
                                                                                    style={{ width: '30px', height: '30px', padding: 0, marginLeft: '6px', flexShrink: 0 }}
                                                                                    onClick={() => handleCommentSubmit(lead)}
                                                                                    disabled={commentSubmitting}
                                                                                >
                                                                                    {commentSubmitting ? <Spinner animation="border" size="sm" /> : '↑'}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td>
                                                                <div className="d-flex gap-2 align-items-center">
                                                                    <Button
                                                                        variant="light"
                                                                        size="sm"
                                                                        title="View"
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
                                                                            const targetType = isLandlord ? 'landlord' : 'tenant';
                                                                            navigate('/comment', {
                                                                                state: { leadId: lead.leadId ?? lead.lead_id, targetType },
                                                                            });
                                                                        }}
                                                                    >
                                                                        <IconifyIcon icon="ri:time-line" width={18} height={18} />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardBody>

                        {/* ── Pagination ────────────────────────────────────────────────────── */}
                        {!loading && !error && totalPages > 1 && (
                            <CardFooter>
                                <nav>
                                    <ul className="pagination justify-content-end mb-0">
                                        <li className={`page-item ${currentPage <= 1 ? 'disabled' : ''}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage <= 1}
                                            >
                                                Previous
                                            </button>
                                        </li>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter((p) =>
                                                p === 1 || p === totalPages ||
                                                (p >= currentPage - 2 && p <= currentPage + 2)
                                            )
                                            .reduce((acc, p, idx, arr) => {
                                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                                acc.push(p);
                                                return acc;
                                            }, [])
                                            .map((item, idx) =>
                                                item === '...' ? (
                                                    <li key={`ellipsis-${idx}`} className="page-item disabled">
                                                        <span className="page-link">…</span>
                                                    </li>
                                                ) : (
                                                    <li
                                                        key={item}
                                                        className={`page-item ${currentPage === item ? 'active' : ''}`}
                                                    >
                                                        <button
                                                            type="button"
                                                            className="page-link"
                                                            onClick={() => goToPage(item)}
                                                        >
                                                            {item}
                                                        </button>
                                                    </li>
                                                )
                                            )}

                                        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage >= totalPages}
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

            {/* ── Convert Confirmation Modal ──────────────────────────────────────── */}
            {convertModal.show && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget && !converting)
                            setConvertModal({ show: false, lead: null });
                    }}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '28px 32px',
                            width: '420px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                        }}
                    >
                        <div
                            style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '50%',
                                backgroundColor: '#ede9fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}
                        >
                            <IconifyIcon icon="ri:exchange-line" width={26} height={26} color="#604ae3" />
                        </div>

                        <h5 style={{ fontWeight: 700, marginBottom: '8px', color: '#1a1a2e' }}>
                            Convert Lead?
                        </h5>

                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>
                            Are you sure you want to convert
                        </p>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#604ae3', marginBottom: '20px' }}>
                            {[convertModal.lead?.firstName, convertModal.lead?.lastName]
                                .filter(Boolean).join(' ') || `Lead #${convertModal.lead?.leadId}`}
                        </p>

                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>
                            This will mark the lead as <strong>Active / Converted</strong>. This action cannot be undone.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                disabled={converting}
                                onClick={() => setConvertModal({ show: false, lead: null })}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: '10px',
                                    border: '1.5px solid #e5e7eb',
                                    backgroundColor: '#fff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#374151',
                                    cursor: converting ? 'not-allowed' : 'pointer',
                                    opacity: converting ? 0.6 : 1,
                                }}
                            >
                                No, Cancel
                            </button>

                            <button
                                disabled={converting}
                                onClick={handleConvert}
                                style={{
                                    flex: 1,
                                    padding: '10px 0',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: converting ? '#9ca3af' : '#604ae3',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#fff',
                                    cursor: converting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                }}
                            >
                                {converting ? (
                                    <>
                                        <Spinner animation="border" size="sm" />
                                        Converting...
                                    </>
                                ) : (
                                    'Yes, Convert'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TotalLeadList;