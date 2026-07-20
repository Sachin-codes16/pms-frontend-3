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

## 13. Check-In Dashboard (2026-07-15)

**Context:** Binding `GET /checkin-checkout/check_in/dashboard/summary/`, `GET /checkin-checkout/check_in/dashboard/upcoming/`, and `GET /checkin-checkout/check_in/get_all/` to the Check-In Dashboard screen.

### 13.1 Anonymous Requests Return a Raw Django Debug Traceback, Not 401

**Problem:** Calling any of the three endpoints without a bearer token returns HTTP 200 with a full Django debug/exception page (stack trace, installed apps, middleware list, server paths) instead of a clean `401 Unauthorized`:
```
AttributeError at /checkin-checkout/check_in/dashboard/summary/
'AnonymousUser' object has no attribute 'user_id'
```
This confirms `DEBUG=True` on what appears to be the working/production host (`alw.checkour.work`), and leaks internal file paths, installed app list, and Python/Django versions to unauthenticated clients.

**Required:** Set `DEBUG=False` on the deployed instance, and have the view return `401` for unauthenticated requests instead of raising an unhandled `AttributeError` (looks like the view code accesses `request.user.user_id` without checking `request.user.is_authenticated` first).

### 13.2 `dashboard/summary/` — Response Shape (confirmed via live test account)

```json
{
  "status": true,
  "message": "Check-In dashboard summary fetched successfully",
  "data": {
    "totalCheckIns": 27,
    "completed": 0,
    "completedChangePercentage": 0.0,
    "inProgress": 2,
    "pending": 25,
    "cancelled": 0,
    "statusOverview": {
      "completed": { "count": 0, "percentage": 0.0 },
      "inProgress": { "count": 2, "percentage": 7.41 },
      "pending": { "count": 25, "percentage": 92.59 },
      "cancelled": { "count": 0, "percentage": 0.0 }
    },
    "propertyTypeOverview": { "Commercial": 10, "Flat": 17 },
    "workflow": {
      "visitScheduled": 27,
      "inspectionCompleted": 2,
      "agreementInProgress": 2,
      "companySigned": 1,
      "agreementCompleted": 0
    }
  }
}
```
Mapped directly to the 5 stat cards, the "Check-in Status Overview" donut, the "Check-in Property Type" bar chart, and the "Check-in Workflow" step list. All confirmed working with real data.

**Note:** `propertyTypeOverview` only includes property types that have at least one check-in (dynamic key set — in this test account only `Commercial` and `Flat` appear, not the full `Villa`/`Apartment`/`Flat`/`Commercial` set from the original mockup). The frontend now renders whatever keys are present and assigns colors cyclically. If a fixed/canonical list of property types is expected to always render (even at zero), the backend should return all known types with `0` rather than omitting them.

### 13.3 `dashboard/upcoming/` — Always Empty on Test Account, Item Shape Unverified

**Problem:** `GET /checkin-checkout/check_in/dashboard/upcoming/?page_num=1&limit=10` returns the expected paginated envelope (`{ data: { data: [], presentPage, totalPage } }`) but `data.data` was empty on every check performed, because none of the 27 check-in records on the test account have a `checkInDate` in the future relative to server time (all are dated 2026-06-05 through 2026-07-11, server "today" is 2026-07-15).

**Impact:** Could not verify the actual field names of an upcoming-check-in list item (e.g. whether there's a dedicated appointment/visit time field, since `get_all/` items only expose a date with no time component). The frontend maps items defensively (`checkInDate`/`scheduledDate`/`date`, `tenantName`/`tenant`, `buildingName`+`flatUnitNumber`/`property`, `checkInTime`/`time`, `assignedEmployee.name`/`assignedTo`, `assignedEmployee.avatar`/`avatar`) based on the naming convention confirmed on `get_all/`, and falls back to reasonable empty-state values.

**Required:** Provide a sample response (or seed a check-in with a future date) so the frontend can confirm exact field names, in particular whether a specific visit **time** is stored anywhere (the original dashboard mockup shows e.g. "10:00 AM" per upcoming check-in).

### 13.4 `get_all/` Confirms No `avatar`/Photo Field on `assignedEmployee`

**Problem:** `assignedEmployee` only ever returns `{ "name": "..." }` — no avatar/photo URL. The original static mockup used external `pravatar.cc` placeholder images for the "Assigned To" avatars.

**Fix applied (frontend):** Replaced the placeholder avatar image with a generated initials avatar when no `avatar` URL is present, rather than continuing to fabricate a photo.

**Required (optional):** If a real employee profile photo should be shown, expose it as `assignedEmployee.avatar`/`profilePhoto` in both `get_all/` and `dashboard/upcoming/`.

### 13.5 `get_all/` — No Formatted Check-In Code

**Problem:** The original static mockup showed a formatted ID like `"CHK-123-6589"` (and, per earlier testing, that exact same string was hardcoded for every row — a frontend mock bug, not a backend issue). The real API only returns a numeric `checkInId` (e.g. `37`, `36`, `35`, …), no formatted code field.

**Frontend fix applied:** The "Check-In ID" column now shows the raw numeric `checkInId`, which is correctly unique per row.

**Required (optional):** If a human-readable formatted code (e.g. `CHK-2026-0037`) is expected in the "Check-In ID" column per the design mockup, expose it as a field (e.g. `checkInCode`) in the `get_all/` response.

By contrast, `check_out/get_all/` **does** return a formatted `checkOutCode` (e.g. `"CHKOUT-000007"`) per record — see §14.4. Worth aligning check-in to the same convention.

---

## 14. Check-Out Dashboard (2026-07-15)

**Context:** Binding `GET /checkin-checkout/check_out/dashboard/summary/`, `GET /checkin-checkout/check_out/dashboard/upcoming/`, `GET /checkin-checkout/check_out/dashboard/widgets/`, and `GET /checkin-checkout/check_out/get_all/` (filtered to `check_out_status=Pending`) to the Check-Out Dashboard screen. All four confirmed live and working end-to-end with the same test account used for §13.

### 14.1 `dashboard/summary/` — Response Shape (confirmed)

```json
{
  "status": true,
  "message": "Check-Out dashboard summary fetched successfully",
  "data": {
    "totalCheckOuts": 7,
    "pendingCheckOuts": 4,
    "completedCheckOuts": 0,
    "pendingSettlements": 0,
    "overdueCheckOuts": 2,
    "statusOverview": {
      "completed": { "count": 0, "percentage": 0.0 },
      "inProgress": { "count": 3, "percentage": 33.33 },
      "pending": { "count": 4, "percentage": 44.44 },
      "overdue": { "count": 2, "percentage": 22.22 }
    },
    "progress": {
      "requestRaised": 7, "inspection": 3, "repairAndDamage": 1,
      "utilityReading": 1, "settlement": 0, "completed": 0,
      "overallProgressPercentage": 0.0
    }
  }
}
```
Maps directly to the 5 stat cards, the "Check-Out Status Overview" donut, and the "Check-Out Progress" step pipeline + overall progress bar. All confirmed working with real data (screenshot matched the API response exactly).

**Note:** `progress.overallProgressPercentage` returned `0.0` even though several pipeline steps have non-zero counts (`requestRaised: 7`, `inspection: 3`, etc.) — this appears correct given `completed: 0`, but confirm the intended formula (e.g. `completed / requestRaised` vs. an average across all steps) so the "Overall Progress" bar reads as expected once records start reaching later stages.

### 14.2 `dashboard/upcoming/` — Response Shape (confirmed, includes per-item `daysLeft`)

```json
{
  "status": true,
  "message": "Upcoming check-outs fetched successfully",
  "data": {
    "data": [{
      "checkOutId": 5, "checkOutDate": "2026-07-15", "daysLeft": 0,
      "tenantId": 110, "tenantName": "Umesh12 Gundre",
      "propertyId": 72, "propertyName": "Al Mouj Residency",
      "assignedEmployeeId": 36, "assignedEmployeeName": "Marketing1"
    }],
    "presentPage": 1, "totalPage": 1
  }
}
```
Unlike the check-in dashboard's `upcoming/` endpoint (§13.3, always empty on this test account), check-out's returned real data and confirms the field names used, including a precomputed `daysLeft` integer (mapped directly to "Days Left : X Days" / "Today" in the UI). No `assignedEmployeeAvatar`/photo field — same as check-in, the frontend renders a generated-initials avatar instead of a placeholder image.

### 14.3 `dashboard/widgets/` — Response Shape (confirmed); `topDamageCategories` Always Empty

```json
{
  "status": true,
  "message": "Check-Out dashboard widgets fetched successfully",
  "data": {
    "financialOverview": { "totalPendingAmount": 1397.0, "collectedThisMonth": 1603.0 },
    "topDamageCategories": [],
    "utilityOverview": { "totalUtility": 5, "pendingReadings": 0, "paidReadings": 5, "otherPending": 1 },
    "keyReturnStatus": { "totalKeysIssued": 3, "keysReturned": 2, "keysPending": 1 }
  }
}
```
`financialOverview`, `utilityOverview`, and `keyReturnStatus` map 1:1 to their respective cards and are confirmed correct.

**Problem:** `topDamageCategories` was `[]` on every check performed — consistent with §4.0 (no repair/damage item creation endpoint exists, so `repairDamage.summary` counts are always `0` on individual records too). The frontend now renders "No data available." in the "Top Damage Categories" card instead of hardcoded mock rows, but the item shape (`{category, count}` assumed) is unverified since no live example exists.

**Required:** Once `POST /check_out/repair_item/create/` (or equivalent) exists per §4.0, confirm `topDamageCategories` populates with the expected `{category, count}` shape (or document the actual field names).

### 14.4 `get_all/` Confirms a Working Formatted Check-Out Code

**Positive finding:** Unlike `check_in/get_all/` (§13.5), `check_out/get_all/` returns a proper formatted `checkOutCode` field (e.g. `"CHKOUT-000007"`), unique per record and directly usable as the "Check-Out ID" column — no frontend workaround needed here.

### 14.5 `filter_key=check_out_status&filter_value=Pending` Appears to Substring-Match, Not Exact-Match

**Problem:** Calling `GET /check_out/get_all/?filter_key=check_out_status&filter_value=Pending` returned records with `checkOutStatus: "Pending"` **and** `checkOutStatus: "Inspection Pending"` — i.e. the filter matched any status containing the substring "Pending", not just the exact value.

**Impact:** If a "Pending" filter is meant to isolate only records awaiting action (as opposed to those already inspected), this over-matches. In this particular case it doesn't visibly break the Pending Check-Outs table (both statuses are legitimately un-finished check-outs), but it's worth confirming this is intentional filter behavior rather than an accidental `icontains` instead of an exact match/enum comparison.

**Required:** Confirm whether `filter_value` is intended to be an exact match against `check_out_status` choices, or a documented partial-match search — if the latter, note it so the frontend doesn't rely on exact-match semantics elsewhere.

### 14.6 `get_all/` — `checkOutDate` Frequently `null`; No `daysLeft` Field (Unlike `dashboard/upcoming/`)

**Problem:** Several records in `get_all/` have `checkOutDate: null` (e.g. `checkOutId: 7, 6, 4`), and the endpoint does not return a precomputed `daysLeft` field the way `dashboard/upcoming/` does.

**Frontend fix applied:** The "Days Left" column in the Pending Check-Outs table is computed client-side from `checkOutDate` (today vs. target date), showing `"—"` when `checkOutDate` is `null`, `"Today"` for same-day, `"Overdue"` for past dates, or `"N Days"` for future dates.

**Required (optional):** For consistency, consider adding a `daysLeft` field to `get_all/` as well, computed server-side the same way as `dashboard/upcoming/`, so the frontend doesn't need to duplicate that logic.

---

## 15. Main Dashboard (2026-07-15)

**Context:** Binding `GET /checkin-checkout/dashboard/summary/`, `GET /checkin-checkout/dashboard/pending_settlements/`, `GET /checkin-checkout/check_in/get_all/`, and `GET /checkin-checkout/check_out/get_all/` to the top-level Main Dashboard (`/dashboards`) screen. The "Upcoming Activities" widget (Check-In/Check-Out/Inspection/Key Handover/Maintenance) was intentionally left static per product decision — no API was provided for it and no backend endpoint exists for the Inspection/Key Handover/Maintenance activity types.

### 15.1 `dashboard/summary/` — Response Shape (confirmed)

```json
{
  "status": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "totalCheckIns": 27, "pendingCheckIns": 25, "totalCheckOuts": 7,
    "pendingCheckOuts": 4, "pendingSettlements": 0,
    "statusOverview": {
      "checkedIn": { "count": 0, "percentage": 0.0 },
      "checkedOut": { "count": 0, "percentage": 0.0 },
      "pendingCheckIn": { "count": 25, "percentage": 86.21 },
      "pendingCheckOut": { "count": 4, "percentage": 13.79 }
    },
    "monthlyOverview": [
      { "month": "Feb", "year": 2026, "checkedIn": 0, "checkedOut": 0 },
      { "month": "Mar", "year": 2026, "checkedIn": 0, "checkedOut": 0 },
      { "month": "Apr", "year": 2026, "checkedIn": 0, "checkedOut": 0 },
      { "month": "May", "year": 2026, "checkedIn": 0, "checkedOut": 0 },
      { "month": "Jun", "year": 2026, "checkedIn": 2, "checkedOut": 0 },
      { "month": "Jul", "year": 2026, "checkedIn": 23, "checkedOut": 3 }
    ]
  }
}
```
Maps to 4 of the 5 stat cards, the "Status Overview" donut, and the "Check-in & Check-Out Overview" grouped bar chart. All confirmed working with real data.

**Note (`pendingSettlements` is a count here, not a currency amount):** This field returns a plain integer count (`0`), matching the same field's behavior on the Check-Out dashboard summary (§14.1). However, the Main Dashboard's "Pending Settlements" stat card in the design mockup is formatted as a currency value (`"OMR 1254"`). Per product decision, the frontend now computes this card by summing `amount` across `dashboard/pending_settlements/` list items instead of using this count field. If `summary.pendingSettlements` was actually intended to double as a currency total, clarify the intended type/unit; otherwise this field is redundant with (and inconsistent in meaning from) the list endpoint's totals.

**Note (dynamic month range, not a fixed calendar year):** `monthlyOverview` returns a rolling 6-month window ending at the current month (`Feb`–`Jul` 2026 when queried in July), not a fixed `Jan`–`Jun`/`Jan`–`Dec` range as the original static mockup assumed. The frontend now renders whatever categories/months the API returns rather than assuming `Jan`–`June`. Confirm this rolling-window behavior is intentional.

### 15.2 `dashboard/pending_settlements/` — Always Empty; Item Shape Unverified

**Problem:** `GET /checkin-checkout/dashboard/pending_settlements/?page_num=1&limit=10` returned `{ data: { data: [], presentPage: 1, totalPage: 1 } }` on every check — consistent with `summary.pendingSettlements: 0` on the same test account, so this is plausibly correct (no pending settlements currently exist), but it means the actual item shape (tenant/property/amount field names) could not be verified against live data.

**Frontend approach:** Mapped defensively across plausible field names (`tenantName`/`tenant`/`name`, `buildingName`+`flatUnitNumber`/`property`/`propertyName`, `amount`/`pendingAmount`/`settlementAmount`), and the "Pending Settlements" list widget + stat card both show an empty/zero state correctly when the list is empty.

**Required:** Once a record with an actual pending settlement exists, confirm the item field names against this mapping so the defensive fallbacks can be simplified/corrected if needed.

### 15.3 `check_in/get_all/` and `check_out/get_all/` Reused As-Is

Both list endpoints behave identically to their dedicated dashboard-controller usage documented in §13 and §14 (same field names, same `checkOutCode` vs. missing `checkInCode` asymmetry from §13.5/§14.4, same `null` `checkOutDate`s requiring client-side "Days Left" computation from §14.6). No new issues found specific to their use on this screen.

### 15.4 Frontend Cleanup Note (not a backend issue)

While wiring this screen, found the donut chart's legend list was hardcoded as a **second, separate array** duplicating the same 4 labels/percentages already present in the chart's `series`/`labels` config (`SocialSource.jsx`) — two sources of truth for the same numbers that could silently drift out of sync. Consolidated to a single data source now that both are API-driven. Also renamed the mental model (not the file, to minimize diff) of `SalesLocation.jsx` — its exported component is `CheckInOutOverview`, a leftover name from the template it was copied from; the file still renders the "Check-in & Check-Out Overview" bar chart, just noting the filename/content mismatch for future reference.

---

*End of Notes*
