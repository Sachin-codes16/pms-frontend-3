// @refresh reset
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useRef, useState } from "react";
import { Button, Card, CardBody, Col, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import useCheckIn from "@/hooks/useCheckIn";
import checkInApi from "@/helpers/checkInApi";
import { resolvePhotoSrc } from "@/utils/imageStorage";

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

// Only these fields are ever sent to the property_inspection PATCH — keeps the
// dynamic Inspection Items / Photos inputs (added below) from leaking into it.
const PROPERTY_INSPECTION_FIELDS = Object.keys(FIELD_PATHS);

const INSPECTION_ITEM_ENDPOINT = "/checkin-checkout/check_in/inspection_item/create/";
const INSPECTION_DOCUMENT_ENDPOINT = "/checkin-checkout/check_in/document/upload/";

// Confirmed against the live API schema (CategoryEnum / InspectionStatusEnum / etc.)
const CATEGORY_OPTIONS = [
  'Walls & Ceilings', 'Door & Windows', 'Electrical Fittings', 'Plumbing',
  'Kitchen', 'Bathrooms', 'Furniture & Fixtures', 'Hall', 'Others',
];
const INSPECTION_STATUS_OPTIONS = ['Good', 'Issue', 'Not Applicable'];
const SEVERITY_OPTIONS = ['High', 'Medium', 'Low'];
const REPAIR_STATUS_OPTIONS = ['Required', 'Pending', 'Repaired'];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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

const selectFieldStyle = {
  ...fieldStyle,
  paddingRight: 40,
  appearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23526b89' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 20px center',
  backgroundSize: '16px',
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
    <select name={name} defaultValue={defaultValue ?? ''} style={selectFieldStyle}>
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

const InspectionItemRow = ({ rowId, onRemove, removable }) => (
  <div className="mb-4" style={{ background: '#fbfcfd', border: '1px solid #e7e9ef', borderRadius: 8, padding: 20 }}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="mb-0" style={{ color: '#526b89', fontSize: 15, fontWeight: 700 }}>Item</h6>
      {removable && (
        <button
          type="button"
          onClick={() => onRemove(rowId)}
          style={{ background: 'none', border: 'none', color: '#bd2d3a', fontSize: 14, padding: 0 }}
        >
          Remove
        </button>
      )}
    </div>
    <Row className="g-4">
      <Col md={4}>
        <SelectField label="Category" name={`item_${rowId}_category`} options={CATEGORY_OPTIONS} />
      </Col>
      <Col md={4}>
        <Field label="Item Name" name={`item_${rowId}_item_name`} />
      </Col>
      <Col md={4}>
        <SelectField label="Status" name={`item_${rowId}_inspection_status`} options={INSPECTION_STATUS_OPTIONS} />
      </Col>
      <Col md={4}>
        <SelectField label="Severity" name={`item_${rowId}_severity`} options={SEVERITY_OPTIONS} />
      </Col>
      <Col md={4}>
        <SelectField label="Repair Status" name={`item_${rowId}_repair_status`} options={REPAIR_STATUS_OPTIONS} />
      </Col>
      <Col md={4}>
        <div>
          <label style={labelStyle}>Photo</label>
          <input type="file" name={`item_${rowId}_photo`} accept="image/*" style={{ ...fieldStyle, padding: '7px 8px' }} />
        </div>
      </Col>
      <Col md={12}>
        <Field label="Remarks" name={`item_${rowId}_remarks`} />
      </Col>
    </Row>
  </div>
);

const InspectionEditDetailsPage = ({ mode = 'check-in' }) => {
  const location  = useLocation();
  const isCheckOut = mode === 'check-out';
  const params    = new URLSearchParams(location.search);
  const id        = params.get('id');
  const backPath  = isCheckOut ? `/check-out-details?id=${id}` : `/check-in-information?id=${id}&tab=inspection`;

  const { item, loading, updateSections, fetchItem } = useCheckIn({ id });
  const formRef   = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [itemRowIds, setItemRowIds] = useState([1]);
  const nextRowId = useRef(2);

  const gv = (name) => getValue(item, name);

  const inspectionItemsList = item?.inspection?.inspectionsList ?? [];
  const inspectionPhotos    = item?.inspection?.inspectionPhotos ?? [];

  const addItemRow = () => setItemRowIds((rows) => [...rows, nextRowId.current++]);
  const removeItemRow = (rowId) => setItemRowIds((rows) => rows.filter((r) => r !== rowId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!id) {
      alert('Cannot submit: no check-in id in the URL.');
      return;
    }
    const form = formRef.current;
    const formData = new FormData(form);
    const body = {};
    for (const [k, v] of formData.entries()) {
      if (!PROPERTY_INSPECTION_FIELDS.includes(k)) continue;
      if (v === '') continue;
      body[k] = v;
    }

    // Only rows where the user actually entered an Item Name are treated as
    // real items — Category/Status are required by the API once that happens.
    const itemDrafts = [];
    for (const rowId of itemRowIds) {
      const itemName = form.querySelector(`[name="item_${rowId}_item_name"]`)?.value?.trim();
      if (!itemName) continue;
      const category = form.querySelector(`[name="item_${rowId}_category"]`)?.value;
      const inspectionStatus = form.querySelector(`[name="item_${rowId}_inspection_status"]`)?.value;
      if (!category || !inspectionStatus) {
        toast.error(`Inspection item "${itemName}": Category and Status are required.`);
        return;
      }
      itemDrafts.push({
        category,
        itemName,
        inspectionStatus,
        severity: form.querySelector(`[name="item_${rowId}_severity"]`)?.value || undefined,
        repairStatus: form.querySelector(`[name="item_${rowId}_repair_status"]`)?.value || undefined,
        remarks: form.querySelector(`[name="item_${rowId}_remarks"]`)?.value || undefined,
        file: form.querySelector(`[name="item_${rowId}_photo"]`)?.files?.[0],
      });
    }

    const photoFiles = Array.from(form.querySelector('[name="inspection_photos"]')?.files ?? []);

    try {
      setSubmitting(true);

      const requests = [updateSections(id, { property_inspection: body })];

      for (const draft of itemDrafts) {
        requests.push(
          (async () => {
            const payload = {
              check_in_id: Number(id),
              category: draft.category,
              item_name: draft.itemName,
              inspection_status: draft.inspectionStatus,
            };
            if (draft.severity) payload.severity = draft.severity;
            if (draft.repairStatus) payload.repair_status = draft.repairStatus;
            if (draft.remarks) payload.remarks = draft.remarks;
            if (draft.file) payload.photo = await fileToBase64(draft.file);
            return checkInApi.post(INSPECTION_ITEM_ENDPOINT, payload);
          })()
        );
      }

      for (const file of photoFiles) {
        requests.push(
          (async () => {
            const base64 = await fileToBase64(file);
            return checkInApi.post(INSPECTION_DOCUMENT_ENDPOINT, {
              check_in_id: Number(id),
              document_type: 'Inspection Photo',
              file: base64,
            });
          })()
        );
      }

      await Promise.all(requests);
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

                  {/* Section A — Inspection Items */}
                  <h5 style={sectionTitleStyle}>A. Inspection Items</h5>

                  {inspectionItemsList.length > 0 ? (
                    <div style={{ border: '1px solid #e4e8ed', borderRadius: 8, marginBottom: 28, overflow: 'hidden' }}>
                      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                          <tr style={{ background: '#fbfcfd' }}>
                            {['Category', 'Total Items', 'Good', 'Issues', 'N/A', 'Status'].map((h) => (
                              <th key={h} style={{ color: '#526b89', fontSize: 15, fontWeight: 700, padding: '14px 18px', textAlign: 'left' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {inspectionItemsList.map((row, index) => (
                            <tr key={row.category ?? index} style={{ borderTop: '1px solid #f0f2f5' }}>
                              <td style={{ color: '#526b89', fontSize: 15, padding: '12px 18px' }}>{row.category ?? '—'}</td>
                              <td style={{ color: '#526b89', fontSize: 15, padding: '12px 18px' }}>{row.totalItems ?? 0}</td>
                              <td style={{ color: '#526b89', fontSize: 15, padding: '12px 18px' }}>{row.good ?? 0}</td>
                              <td style={{ color: '#526b89', fontSize: 15, padding: '12px 18px' }}>{row.issues ?? 0}</td>
                              <td style={{ color: '#526b89', fontSize: 15, padding: '12px 18px' }}>{row.notApplicable ?? 0}</td>
                              <td style={{ color: '#526b89', fontSize: 15, padding: '12px 18px' }}>{row.status ?? '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: '#526b89', fontSize: 15, marginBottom: 28 }}>No inspection items recorded yet.</p>
                  )}

                  {itemRowIds.map((rowId) => (
                    <InspectionItemRow
                      key={rowId}
                      rowId={rowId}
                      onRemove={removeItemRow}
                      removable={itemRowIds.length > 1}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={addItemRow}
                    className="mb-5"
                    style={{ background: 'none', border: '1px dashed #8a96a8', borderRadius: 5, color: '#526b89', fontSize: 15, padding: '10px 16px' }}
                  >
                    + Add Another Item
                  </button>

                  {/* Section B — Inspection Photos */}
                  <h5 style={sectionTitleStyle}>B. Inspection Photos</h5>

                  {inspectionPhotos.length > 0 ? (
                    <div className="d-flex gap-3 mb-3">
                      {inspectionPhotos.map((photo, index) => (
                        <img
                          key={photo ?? index}
                          alt="Inspection"
                          src={resolvePhotoSrc(photo)}
                          style={{ borderRadius: 8, height: 78, objectFit: 'cover', width: 110 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#526b89', fontSize: 15 }}>No photos uploaded yet.</p>
                  )}

                  <div className="mb-5">
                    <label style={labelStyle}>Upload New Photos</label>
                    <input
                      type="file"
                      name="inspection_photos"
                      accept="image/*"
                      multiple
                      style={{ ...fieldStyle, padding: '7px 8px' }}
                    />
                  </div>

                  {/* Section C — Inspection Overview */}
                  <h5 id="property-inspection" style={sectionTitleStyle}>C. Inspection Overview</h5>
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

                  {/* Section D — Remarks */}
                  <h5 id="remarks" style={sectionTitleStyle}>D. Remarks</h5>
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

                  {/* Section E — System Fields */}
                  <h5 id="system-fields" style={sectionTitleStyle}>E. System Fields</h5>
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
