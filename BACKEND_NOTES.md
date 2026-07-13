# Backend Developer Notes
## PMS Frontend — Check-In / Check-Out API Issues & Requirements

**Date:** 2026-07-01  
**Prepared by:** Frontend Team  
**Context:** These notes cover all API issues, missing endpoints, field mapping problems, and data population gaps discovered while building and testing the Check-In and Check-Out detail pages.

---

## 1. Tenant Details Tab

### 1.1 Extended Tenant Profile Fields — No Writable API

**Problem:** The following fields appear in `GET /check_out/get/` → `tenantDetails.personalDetails` and `tenantDetails.professionalDetails` but **cannot be written** through any available endpoint:

| Field in Response | Expected Source | Current State |
|---|---|---|
| `personalDetails.gender` | Extended tenant profile | Always `null` |
| `personalDetails.dateOfBirth` | Extended tenant profile | Always `null` |
| `personalDetails.maritalStatus` | Extended tenant profile | Always `null` |
| `personalDetails.tenantNationality` | FK to Nationality table | Returns string name; `PATCH /update/tenant_details/` with `tenant_nationality` causes `'Nationality' object has no attribute 'id'` error |
| `professionalDetails.profession` | Extended tenant profile | Always `null` |
| `professionalDetails.companyName` | Extended tenant profile | Always `null` |
| `contactDetails.emergencyContactName` | Extended tenant profile | Always `null` |
| `contactDetails.emergencyContactNumber` | Extended tenant profile | Always `null` |

**Attempts made (all failed to persist):**
- `PATCH /checkin-checkout/check_out/update/tenant_details/` with these fields → returns `200 ✓` but data doesn't persist
- `PUT /lead/update/` with these fields → Lead model doesn't have these fields
- Direct check-out record update → no single-record update endpoint exists

**Required:** A writable API endpoint to update the extended tenant/lead profile. Suggested: `PATCH /lead/profile/update/` or include these fields in the working `PATCH /check_out/update/tenant_details/` endpoint.

### 1.2 Nationality — FK Constraint Error

**Problem:** `PATCH /check_out/update/tenant_details/` with `tenant_nationality: "Omani"` returns:
```json
{ "error": "Exception Error 'Nationality' object has no attribute 'id'" }
```
The frontend sends the nationality **name** string but the backend tries to look up `.id` on it.

**Required:** Either:
- Accept nationality as a string directly, OR
- Expose `GET /nationalities/` endpoint returning `[{id, name}]` so the frontend can send the correct FK integer

### 1.3 Tenant Documents — Missing `documentName` Field

**Problem:** `tenantDetails.tenantDocuments` items are missing `documentName`/`name`. Response structure:
```json
{
  "documentId": 7,
  "documentType": "Tenant ID Proof",
  "file": "/media/.../photo.jpg",
  "uploadedOn": "2026-07-01T..."
}
```
`documentName` is absent, causing the frontend to fall back to "Document 1", "Document 2", etc.

**Required:** Add `documentName` field to `tenantDocuments` array items in the GET response.

---

## 2. Property Details Tab

### 2.1 `rentalDetails` Always Empty

**Problem:** `propertyDetails.rentalDetails` is always `{}` for ALL check-out records. The frontend expects:
```json
{
  "rentStartDate": "2025-07-15",
  "rentEndDate": "2026-07-14",
  "agreementDuration": "12 Months",
  "maintenanceRequired": "Yes",
  "maintenanceStatus": "Active",
  "paymentMode": "Bank Transfer"
}
```

**Required:** Populate `propertyDetails.rentalDetails` from the linked rental/agreement record.

### 2.2 `agreementDetails` Always Empty

**Problem:** `propertyDetails.agreementDetails` is always `{}` for ALL check-out records. The frontend expects:
```json
{
  "agreementType": "Residential Lease",
  "agreementPreparedBy": "Legal Department",
  "agreementStatus": "Active"
}
```

**Required:** Populate from the linked agreement record.

### 2.3 No Agreement Creation Endpoint

**Problem:** No endpoint exists to create or link a rental agreement to a property. Tested paths — all 404:
- `POST /agreement/create/`
- `POST /rental/agreement/create/`
- `POST /property/agreement/create/`
- `POST /lease/create/`

The property model has `agreementId: 0` / `null` for all properties, and there's no way to set it.

**Required:** `POST /agreement/create/` endpoint with fields: `property_id`, `tenant_id`, `agreement_type`, `start_date`, `end_date`, `rent_amount`, `security_deposit`, `payment_mode`, `maintenance_required`, `maintenance_status`, `agreement_status`, `prepared_by`.

### 2.4 `landlordName` Not Writable

**Problem:** `propertyDetails.ownership.landlordName` is always `null`. Setting `landlord_id: 36` via `PUT /property/update/` succeeds but `landlordName` stays `null` in the GET response.

**Required:** The property update should map `landlord_id` to the linked user's name and return it in `ownership.landlordName`.

### 2.5 `plotAreaSqft` Not in Property Model

**Problem:** `propertyDetails.configurationAndArea.plotAreaSqft` is always `null`. Tried `plot_area_sqft`, `plot_area`, `plotAreaSqft` — none persist via `PUT /property/update/`.

**Required:** Add `plot_area_sqft` as a writable field in the property model and expose it in the flat_data or property_details update payload.

---

## 3. Inspection Tab

### 3.1 `inspectionOverview.inspectionDuration` Returns Wrong Field

**Problem:** `inspection.inspectionOverview.inspectionDuration` always returns the `technicianType` value instead of the actual inspection duration.

- Set `technician_type: "Internal"` → `inspectionDuration` shows `"Internal"` ❌
- Set `inspection_duration: "01:45 Hrs"` via update → accepted (✓) but `inspectionDuration` in GET still returns `technicianType` value

**Workaround (frontend):** Renamed the "Inspection Duration" row to "Technician Type" and reads from `record.technicianType` directly.

**Required:** Fix the backend mapping so `inspectionDuration` returns the actual stored inspection duration value, not `technicianType`.

### 3.2 `nextInspectionDue` Update Not Reflected in GET Response

**Problem:** `PATCH /check_out/update/property_inspection/` with `next_inspection_due: "2027-01-09"` returns ✓ but `inspection.inspectionOverview.nextInspectionDue` remains `null` in the GET response.

**Workaround (frontend):** Reads from `record.nextInspectionDue` (top-level) as fallback.

**Required:** `nextInspectionDue` should be returned in `inspectionOverview.nextInspectionDue` after being set.

### 3.3 `recentIssues` and `topIssuesCategories` Always Empty

**Problem:** `inspection.recentIssues` and `inspection.topIssuesCategories` are always `[]` because:
- `POST /check_out/inspection_item/create/` only accepts `inspection_status: "Good"`
- No way to create items with status "Issues" or "Problems"

**Required:** Add `"Issues"`, `"Repaired"`, `"Pending"` as valid `inspection_status` choices so that items with problems populate `recentIssues` and `topIssuesCategories`.

### 3.4 Inspection Photos — Broken Image

**Problem:** `inspection.inspectionPhotos` returns relative media paths. When the document was uploaded as a PDF with `.jpg` extension, the image doesn't render.

**Required:** Either:
- Add a dedicated `POST /check_out/inspection_photo/upload/` endpoint for actual image uploads, OR
- Ensure the `Inspection Photo` document type only accepts image files (`.jpg`, `.png`)

---

## 4. Repair & Damage Tab

### 4.0 No Repair/Damage Item Creation Endpoint

**Problem:** No endpoint exists to create individual repair/damage issue items. All tested paths return 404:
- `POST /check_out/repair_item/create/` → 404
- `POST /check_out/damage_item/create/` → 404
- `POST /check_out/repair/create/` → 404
- `POST /check_out/issue/create/` → 404

As a result, `repairDamage.issueList`, `repairDamage.pendingRepairs`, `repairDamage.repairedPhotos`, `repairDamage.recentResolvedIssues` and all `repairDamage.summary` counts are always `[]`/`0`.

**Required:** `POST /check_out/repair_item/create/` with fields: `check_out_id`, `category`, `issue_description`, `status` (`"Pending"` / `"Required"` / `"Repaired"` / `"No Action"`), `severity`, `estimated_cost`, `assigned_to`.

### 4.0b `recommendedBy`, `approvedBy`, `approvedOn` Not Stored

**Problem:** `PATCH /check_out/update/repair_damage/` accepts `recommended_by`, `approved_by`, `approved_on` (returns ✓) but they remain `null` in `repairDamage.approvalSummary` on GET.

**Required:** Map `recommended_by_id` (int), `approved_by_id` (int), `approved_on` (date) to `approvalSummary.recommendedBy`, `approvedBy`, `approvedOn` in the GET response.

### 4.0c `repairDamage.documents` Missing from Response

**Problem:** `repairDamage.documents` doesn't exist in the GET response — no way to link documents to the repair section.

**Required:** Add `documents[]` to `repairDamage` in the GET response, populated from documents with repair-related types.

---

### 4.1 `inspection_item/create` — Missing `inspection_status` Field

**Problem:** `POST /check_out/inspection_item/create/` requires `inspection_status` but this wasn't documented. Only one valid value found via testing: `"Good"`. Other values (`"Issues"`, `"Pending"`, `"Repaired"`, `"N/A"`, `"Fixed"`) all rejected.

**Required:** Document all valid `inspection_status` choices. Consider adding: `"Issues"`, `"Repaired"`, `"Pending"` to match the check-out repair workflow.

### 3.2 Repair Issues Don't Show in `repairDamage.issueList`

**Problem:** Inspection items created via `POST /check_out/inspection_item/create/` don't appear in `repairDamage.issueList` — they appear in `inspection.inspectionsList` instead. The repair/damage view expects a separate `issueList` that's always `[]`.

**Required:** Clarify whether `repairDamage.issueList` should be populated from inspection items, or if there's a separate repair/damage item creation endpoint.

### 3.3 `repairDamage.summary` Counts Always Zero

**Problem:** `repairDamage.summary.repairItems`, `.repairedItems`, `.approved`, `.estimatedCost` are always `0` even after creating inspection items.

**Required:** These counts should be calculated from the linked inspection/repair items.

---

## 4. Utility Readings Tab

### 4.1 `utility_reading/create` — Valid `status` Values

**Confirmed valid values** (via testing):
- `"Normal"`, `"Fixed"`, `"Issues"`

**Rejected values:** `"High"`, `"Abnormal"`, `"Critical"`, `"High Usage"`

The check-in utility reading edit page uses `["Normal", "Fixed", "Issues", "High", "Abnormal"]` — the check-out API should support the same set. **Required:** Add `"High"` and `"Abnormal"` as valid `status` choices, or document the correct set.

### 4.2 Individual Reading Update Uses Different ID Field

- Check-in: `PATCH /check_in/utility_reading/update/` with `check_in_utility_reading_id`
- Check-out: `PATCH /check_out/utility_reading/update/` with `check_out_utility_reading_id`

This is correct and working. ✅ Just noting for documentation.

### 4.3 `checkInReading` Not Writable — Auto-Populated from Linked Check-In

**Problem:** `readingsList[].checkInReading` is always `null` for check-out records that have `check_in_id: null`. All attempts to set it via `PATCH /check_out/utility_reading/update/` with `check_in_reading`, `check_in_meter_reading`, `previous_reading`, etc. return ✓ but the field stays `null`.

**Root cause:** `checkInReading` is read-only — it is auto-populated from the linked check-in record's meter reading. If no check-in is linked (`check_in_id: null`), it will always be `null`.

**Behaviour:** When a check-out is created from an existing check-in, `checkInReading` will populate automatically. This is by design, but needs documenting so the UI can show the right empty state.

### 4.4 `readingValue` vs `checkOutReading` Field Name Mismatch

**Problem:** The GET response returns the check-out meter reading as `checkOutReading`, not `readingValue`. However, the create and update endpoints accept `reading_value` (snake_case) and store it correctly as `checkOutReading`.

**Frontend fix applied:** `UtilityReadingsPage.jsx` now reads `row.readingValue ?? row.checkOutReading` to handle both names.

**Required:** Standardise the field name — either always use `readingValue` or `checkOutReading` in both create/update payloads and GET responses.

### 4.5 No Meter Photo Upload Endpoint for Check-Out

**Problem:** No endpoint exists to upload meter photos linked to a utility reading:
- `POST /check_out/utility_reading/photo/create/` → 404
- `POST /check_out/meter_photo/upload/` → 404

`utilityReadings.meterPhotos` is always `[]`.

**Required:** A dedicated `POST /check_out/utility_reading/photo/upload/` endpoint that accepts `check_out_utility_reading_id` and a photo file/base64.

### 4.6 No Recent Issues Endpoint

**Problem:** `utilityReadings.recentIssues` is always `[]`. No endpoint to create utility-related issues.

**Required:** Either a dedicated `POST /check_out/utility_issue/create/` endpoint, or link utility readings with `status: "Issues"` to automatically populate `recentIssues`.

### 4.7 Reading Delete Endpoint Available ✅

`DELETE /check_out/utility_reading/delete/` with `{ check_out_utility_reading_id }` works correctly. Used to remove duplicate entries created during status value probing.

---

## 5. Finance Tab

### 5.1 `chargesAndDeductions` Always Empty

**Problem:** `financeDetails.chargesAndDeductions` is always `[]`. No endpoint exists to create individual charge/deduction entries.

**Required:** `POST /check_out/charge/create/` endpoint with fields: `charge_type`, `description`, `amount`, `tax`, `total`, `status`.

### 5.2 `payments` / `paymentTransactions` Not in Response

**Problem:** The Finance tab has a "Payments & Transactions" table but the GET response has no `payments` or `paymentTransactions` array.

**Required:** Add `payments` array to `financeDetails` with fields: `paymentDate`, `paymentMethod`, `transactionId`, `paidBy`, `amount`, `status`.

### 5.3 `charge_type` Valid Values

**Confirmed valid:**
- `"Security Deposit Refund"`, `"Other"`

**Required:** If more charge types are needed (e.g. `"Rent"`, `"Maintenance"`, `"Damage"`), add them to the model choices.

### 5.4 `payment_status` Valid Values

**Confirmed valid:**
- `"Pending"`, `"Paid"`, `"Refunded"`

**Rejected:** `"Partial"`, `"Cancelled"`, `"Processing"`

### 5.5 `POST /check_out/payment/create/` Populates `chargesAndDeductions`, Not a Separate `payments` Array

**Confirmed:** `POST /check_out/payment/create/` with fields `{check_out_id, description, amount, payment_method, transaction_id, payment_date, status}` creates records that appear in `financeDetails.chargesAndDeductions[]`.

**Problem:** The `payments` / `paymentTransactions` array does not exist in the GET response. Records created via `payment/create` go to `chargesAndDeductions` — there is no separate payments table.

**Required:** Either:
- Add a dedicated `POST /check_out/charge/create/` for deductions and use `payment/create` only for actual payments, with both returned in separate arrays, OR
- Document that `payment/create` is the unified endpoint for both charges and payments.

**Charge/Deduction Object Structure (confirmed from GET):**
```json
{
  "checkOutPaymentId": 11,
  "chargeType": "Security Deposit Refund",   ← always same (see §5.6)
  "description": "Outstanding Rent (July 2026)",
  "amount": 1000.0,
  "tax": null,
  "total": 1000.0,
  "status": "Paid",
  "paymentDate": "2026-07-01",
  "receiptRefNo": null   ← transaction_id not mapped here
}
```

### 5.6 `chargeType` Is Global, Not Per-Record

**Problem:** `chargesAndDeductions[].chargeType` always returns the same value as `financeDetails.financeOverview.chargeType` (the top-level charge type set via `PATCH /update/finance_details/`). It does NOT reflect a per-record charge type.

This means ALL rows in the Charges & Deductions table show the same Charge Type regardless of what each charge actually is.

**Required:** Store `charge_type` per payment record so each row can have its own type (e.g. "Outstanding Rent", "Utility Charges", "Damage Deduction", "Security Deposit Refund").

### 5.7 `tax` and `receiptRefNo` Always Null

**Problem:**
- `chargesAndDeductions[].tax` is always `null` — no way to set per-record tax
- `chargesAndDeductions[].receiptRefNo` is always `null` — the `transaction_id` sent in `payment/create` is not mapped to `receiptRefNo` in the GET response

**Required:** Map `transaction_id` → `receiptRefNo` in the GET response so the Invoice/Download column shows the transaction reference.

### 5.8 Payment/Charge Delete Endpoint Available ✅

`DELETE /check_out/payment/delete/` with `{ check_out_payment_id }` works correctly.

---

## 6. Key Handover Tab

### 6.1 `key_return_status` Valid Values

**Confirmed valid:**
- `"Pending"`, `"Returned"`, `"Lost"`

**Rejected:** `"Partial"`, `"Completed"`

### 6.2 `key_return` (Yes/No) vs `key_return_status`

There are two separate fields:
- `key_return` → accepts `"Yes"` / `"No"` (was the key returned?)
- `key_return_status` → accepts `"Pending"` / `"Returned"` / `"Lost"` (overall status)

This is correctly handled. ✅

### 6.3 Key Details Table — `keyDetails` Empty at Start

**Problem:** `keyReturn.keyDetails` starts empty. Keys created via `POST /check_out/key/create/` do populate this array correctly. ✅

### 6.4 Individual Key `status` Field Name Mismatch

**Problem:** `PATCH /check_out/key/update/` with `key_status: "Returned"` is accepted (✓) but `keyDetails[].status` stays `"Pending"` in the GET response.

**Fix:** Use `status` (not `key_status`) in the update payload:
```json
{ "check_out_key_id": 1, "status": "Returned" }
```

**Required:** Either rename the update field to `status` (to match the GET response field) or document that `key_status` is silently ignored.

### 6.5 `keyBookingDate` Not Writable

**Problem:** `keyReturnInformation.keyBookingDate` is always `null`. Tested variants: `key_booking_date`, `booking_date`, `key_booked_date`, `booked_date` — all accepted by `PATCH /update/key_return/` but not reflected in GET response.

**Required:** Map `key_booking_date` to `keyReturnInformation.keyBookingDate` in the GET response.

### 6.6 `keyReturnPhotos` — Broken Image from Document Upload

**Problem:** `keyReturn.keyReturnPhotos` is populated by the `"Key Return Photo"` document type from `POST /check_out/document/upload/`. However, non-image content (e.g. PDF) stored with `.jpg` extension results in broken images.

**Required:** Add a dedicated `POST /check_out/key/photo/upload/` endpoint that only accepts image files, OR enforce image-only validation on `document_type: "Key Return Photo"`.

---

## 7. Documents Tab

### 7.1 `document/upload` Valid `document_type` Values

**Confirmed valid for check-out** (via testing):
- `"Tenant ID Proof"`, `"Agreement Copy"`, `"Inspection Photo"`, `"Key Return Photo"`, `"Passport Copy"`, `"Other"`

**Rejected (work in check-in but not check-out):**
- `"Property Photo"`, `"NOC Certificate"`, `"Rent Invoice"`, `"Company Seal"`, `"Agreement Signed"`

**Required:** Align check-out document types with check-in, or document the intended difference.

### 7.2 `documentsTab.notes` — No Update Endpoint

**Problem:** `documentsTab.notes` is read from the GET response but no `PATCH /check_out/update/documents/` endpoint exists to update it.

**Required:** Either add a `PATCH /check_out/update/documents/` endpoint accepting `{check_out_id, notes}`, or include `notes` in an existing section update.

### 7.3 `documentName` Auto-Generated — User-Provided Name Not Stored

**Problem:** When uploading via `POST /check_out/document/upload/` with `document_name: "Umesh_ID_Proof.pdf"`, the `documentName` in the GET response is the **server-generated filename** (e.g. `property_photo_fa8921a0-1fa2-4ef8-8ad1-09d78a4809e6.jpg`), NOT the user-provided name.

**Impact:** The Documents table shows unreadable auto-generated names instead of meaningful document names.

**Required:** Store the user-provided `document_name` separately from the server file path and return it as `documentName` in the GET response.

### 7.4 `linkedTo` Field Not Stored

**Problem:** Sending `linked_to` in the upload payload is accepted (✓) but `allDocuments[].linkedTo` always returns `null`.

**Required:** Store and return the `linked_to` value per document.

### 7.5 No Document Update Endpoint

**Problem:** No `PATCH /check_out/document/update/` endpoint exists to fix document names or linked_to after upload. All variants tested return 404.

**Required:** `PATCH /check_out/document/update/` with `{check_out_document_id, document_name, linked_to, expiry_date}`.

### 7.6 No Document Delete Endpoint

**Problem:** No `DELETE /check_out/document/delete/` endpoint exists. All variants tested return 404. This means accidentally uploaded or test documents cannot be removed.

**Impact:** Duplicate documents accumulate with no way to clean them up from the frontend.

**Required:** `DELETE /check_out/document/delete/` with `{check_out_document_id}`.

### 7.7 `"Address Proof"` Not a Valid `document_type` But Listed as Missing

**Problem:** The system lists `"Address Proof"` as a missing document for tenant Umesh12 Gundre in `documentsTab.missingDocuments`, but `"Address Proof"` is NOT a valid `document_type` for `POST /check_out/document/upload/`.

**Impact:** The "Missing Documents: 1" stat card cannot be resolved — there's no way to upload an Address Proof.

**Required:** Either:
- Add `"Address Proof"` as a valid `document_type` for upload, OR
- Remove `"Address Proof"` from the missing documents list if it can't be uploaded.

### 7.8 Valid `document_type` Values — Full Confirmed List

```
Valid:   "Tenant ID Proof", "Agreement Copy", "Inspection Photo",
         "Key Return Photo", "Passport Copy", "Other"

Missing: "Address Proof" (required by system but not uploadable)

Invalid: "Property Photo", "NOC Certificate", "Rent Invoice",
         "Company Seal", "Agreement Signed", "Finance Document"
```

---

## 8. Check-Out Create Form

### 8.1 `check_out_status` Valid Values

**Confirmed valid:**
- `"Pending"`, `"Inspection Pending"`, `"Active"`, `"Approved"`, `"Completed"`, `"Cancelled"`

**Rejected:** `"In Progress"`

### 8.2 `repair_priority` Field

The `repair_priority` field is in the check-out model but the check-in uses `repair_required`, `gm_approval` etc. separately. Confirm field name consistency.

---

## 9. Check-In vs Check-Out API Consistency Issues

| Feature | Check-In | Check-Out | Issue |
|---|---|---|---|
| Utility reading create | `check_in_utility_reading_id` | `check_out_utility_reading_id` | ✅ Consistent pattern |
| Inspection item create | Works with many `category` values | Limited to: `"Walls & Ceilings"`, `"Plumbing"`, `"Kitchen"`, `"Electrical Fittings"`, `"Others"` | ❌ Check-out has fewer valid categories |
| Key create | `check_in_key_id` | `check_out_key_id` | ✅ Consistent |
| Document upload | Many document types | Only 6 document types | ❌ Check-out has fewer types |
| `tenant_details` update | Persists `gender`, `profession` etc. | Does NOT persist these fields | ❌ Inconsistent |
| Section update base path | `/check_in/update/{section}/` | `/check_out/update/{section}/` | ✅ Consistent |
| `repair_approval` section | `/check_in/update/repair_approval/` | `/check_out/update/repair_damage/` | ⚠️ Different section key names |

---

## 10. Missing Endpoints Summary

| Endpoint | Purpose | Priority |
|---|---|---|
| `POST /agreement/create/` | Create rental agreement linked to property | **High** |
| `GET /agreement/get/` | Fetch agreement details | **High** |
| `PUT /agreement/update/` | Update agreement | **High** |
| `PATCH /lead/profile/update/` | Update extended tenant profile (gender, DOB, profession, etc.) | **High** |
| `GET /nationalities/` | List valid nationality choices with IDs | **High** |
| `POST /check_out/charge/create/` | Create charges & deductions entry | **Medium** |
| `PATCH /check_out/charge/update/` | Update charge entry | **Medium** |
| `POST /check_out/payment/create/` | Record payment transaction | **Medium** |
| `PATCH /check_out/update/documents/` | Update documents notes | **Low** |

---

## 11. Field Mapping Reference (Check-Out GET Response)

Key nested paths used by the frontend:

```
record.overview.summaryCards.{inspectionStatus, repairDamageItems, utilityCharges, outstanding}
record.overview.progressPipeline[].{stage, status}
record.overview.overallProgress
record.overview.activityTimeline[].{event, description, timestamp}
record.overview.inspectionSummary.{inspectionDate, inspector, status, overallCondition, inspectorComments}
record.overview.financialSummary.{outstandingRent, utilityCharges, damageCharges, otherCharges, totalDeductions, securityDeposit, refundableAmount}

record.tenantDetails.personalDetails.{tenantCode, tenantName, tenantType, dateOfBirth, gender, maritalStatus, tenantNationality}
record.tenantDetails.contactDetails.{tenantMobileNumber, tenantEmail, tenantAddress, emergencyContactName, emergencyContactNumber}
record.tenantDetails.identificationDetails.{tenantCivilId, tenantPassportNumber}
record.tenantDetails.professionalDetails.{profession, companyName}
record.tenantDetails.currentAddress.{propertyName, address, unitType, areaSqft, floor, photos[]}
record.tenantDetails.agreementInformation.{agreementStartDate, agreementEndDate, rentAmount, securityDeposit, paymentMode}
record.tenantDetails.outstandingSummary.{totalPaid, totalPending, utilityCharges, totalDeductions}
record.tenantDetails.tenantDocuments[].{documentId, documentType, documentName, file, uploadedOn}  ← documentName missing

record.propertyDetails.basicInformation.{propertyType, propertyCode, projectOrSociety, nameOrNumber, totalFloors, yearBuilt}
record.propertyDetails.configurationAndArea.{configuration, carpetAreaSqft, builtupAreaSqft, plotAreaSqft, bathrooms, facing}
record.propertyDetails.rentalAndFinancialDetails.{monthlyRent, securityDeposit, maintenance, advanceRent, electricity, waterCharges}
record.propertyDetails.ownership.{landlordName, propertyStatus}  ← landlordName always null
record.propertyDetails.amenitiesAndFacilities[]
record.propertyDetails.rentalDetails.{rentStartDate, rentEndDate, agreementDuration, maintenanceRequired, maintenanceStatus, paymentMode}  ← always {}
record.propertyDetails.agreementDetails.{agreementType, agreementPreparedBy, agreementStatus}  ← always {}
record.propertyDetails.residentialAddress.{address, city, state, poBox, googleMap}
record.propertyDetails.systemInformation.{createdBy, createdOn, lastUpdated}

record.inspection.summary.{totalItems, checked, good, issuesFound, notApplicable}
record.inspection.inspectionsList[].{category, totalItems, good, issuesFound, notApplicable, status}
record.inspection.inspectionOverview.{inspectionDate, inspector, inspectionDuration, overallStatus, nextInspectionDue}
record.inspection.inspectionNotes
record.inspection.topIssuesCategories[].{category, count}
record.inspection.inspectionPhotos[]
record.inspection.recentIssues[]

record.repairDamage.summary.{totalItems, repairItems, repairedItems, noActionRequired, estimatedCost, approved}
record.repairDamage.issueList[]  ← always []
record.repairDamage.approvalSummary.{recommendedBy, approvedBy, approvedOn, overallStatus, landlordConsent, financeAlertGenerated, quotationAmount, rentAdjustmentAmount}
record.repairDamage.pendingRepairs[]
record.repairDamage.repairedPhotos[]
record.repairDamage.recentResolvedIssues[]
record.repairDamage.documents[]

record.utilityReadings.readingsList[].{checkOutUtilityReadingId, utility, meterNo, checkInReading, readingValue, consumption, unit, ratePerUnit, charges, status}
record.utilityReadings.utilitiesOverview.{totalBalance, totalPayable, totalUtilities, totalUnits, totalCurrentCharge, notApplicable}
record.utilityReadings.readingOverview[].{utility, charges}
record.utilityReadings.meterPhotos[]

record.financeDetails.summaryCards.{totalCharges, totalPayments, pendingSettlements, refundAmount}
record.financeDetails.chargesAndDeductions[]  ← always []
record.financeDetails.settlementSummary.{securityDeposit, totalDeductions, totalPaid, refundAmount, settlementStatus}
record.financeDetails.financeOverview.{chargeType, totalAmount, paymentStatus, paymentDate, transactionId, paymentProof}
record.financeDetails.payments[]  ← field doesn't exist

record.keyReturn.summaryCards.{totalKeysIssued, totalKeysReturned, pendingKeys, lostUnreturnedKeys}
record.keyReturn.keyReturnInformation.{keyReturnStatus, keyNumber, keyReturn, expectedReturnDate, keyReturnDate, totalKeys, tenantName, tenantContact, confirmationReceived, receivedBy}
record.keyReturn.keyDetails[].{checkOutKeyId, keyNumber, keyType, status}
record.keyReturn.keyReturnPhotos[]
record.keyReturn.keyReturnSummary.{tenantName, unitNo, checkOutDate, totalKeyIssued, keysReturned, keysPending, status}
record.keyReturn.relatedInformation.{checkOutCode, checkInId, property, tenant, financeStatus, checkOutStatus}

record.documentsTab.summary.{totalDocuments, uploadedDocuments, expiringSoon, missingDocuments}
record.documentsTab.allDocuments[].{documentId, documentName, documentType, category, linkedTo, uploadedBy, uploadedOn, file}
record.documentsTab.expiringSoon[].{title, linkedTo, expiry}
record.documentsTab.missingDocuments[].{documentType, tenant}
record.documentsTab.documentsSummary
record.documentsTab.recentUploads[]
record.documentsTab.notes
```

---

## 12. Valid API Choices Reference

### Check-Out Status
`"Pending"`, `"Inspection Pending"`, `"Active"`, `"Approved"`, `"Completed"`, `"Cancelled"`

### Key Return Status
`"Pending"`, `"Returned"`, `"Lost"`

### Key Return (boolean-ish)
`"Yes"`, `"No"`

### Inspection Item Category (check-out)
`"Walls & Ceilings"`, `"Plumbing"`, `"Kitchen"`, `"Electrical Fittings"`, `"Others"`

### Inspection Item Status (check-out)
`"Good"` ← only confirmed valid value

### Utility Reading Status (check-out)
`"Normal"`, `"Fixed"`, `"Issues"`

### Charge Type
`"Security Deposit Refund"`, `"Other"`

### Payment Status
`"Pending"`, `"Paid"`, `"Refunded"`

### Document Types (check-out)
`"Tenant ID Proof"`, `"Agreement Copy"`, `"Inspection Photo"`, `"Key Return Photo"`, `"Passport Copy"`, `"Other"`

### Property Furnishing Status
`"Unfurnished"`, `"Semi-Furnished"`, `"Fully Furnished"`

### Electricity / Water Charge Type
`"Fixed"` ← only confirmed valid value

---

*End of Notes*
