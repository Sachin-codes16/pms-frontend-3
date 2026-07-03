import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button } from "react-bootstrap";
import { fmtDate, val } from "@/utils/checkInFormat";
import { resolvePhotoSrc } from "@/utils/imageStorage";

const pageText = "#526b89";
const bodyText = "#263244";
const mutedText = "#69798c";

const cardStyle   = { border: "1px solid #dfe5eb", borderRadius: 8, overflow: "hidden" };
const titleStyle  = { background: "#fbfcfd", color: pageText, fontSize: 16, fontWeight: 700, margin: 0, padding: "22px 32px 18px" };

const infoRowStyle = {
  alignItems: "start",
  display: "grid",
  gridTemplateColumns: "150px 18px 1fr",
  minHeight: 40,
};

const InfoRows = ({ items, highlightLast = false }) => (
  <div>
    {items.map(([label, value], index) => {
      const isBold = highlightLast && index === items.length - 1;
      return (
        <div key={label} style={infoRowStyle}>
          <span style={{ color: pageText, fontSize: 16, fontWeight: isBold ? 700 : 400 }}>{label}</span>
          <span style={{ color: pageText, fontSize: 16 }}>:</span>
          <span style={{ color: pageText, fontSize: 16, fontWeight: isBold ? 700 : 400, whiteSpace: "pre-line" }}>
            {value}
          </span>
        </div>
      );
    })}
  </div>
);

const DocumentRow = ({ name, date, url }) => (
  <div className="d-flex align-items-center justify-content-between gap-3" style={{ marginBottom: 24 }}>
    <div className="d-flex align-items-center gap-4">
      <span className="d-inline-flex align-items-center justify-content-center"
        style={{ border: "1px solid #9aa3ad", borderRadius: 5, height: 50, width: 50 }}>
        <IconifyIcon icon="vscode-icons:file-type-pdf2" width={28} height={28} />
      </span>
      <div>
        <p className="mb-1" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>{name}</p>
        <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>{date}</p>
      </div>
    </div>
    <div className="d-flex gap-3">
      <Button as="a" href={url || "#"} target="_blank" rel="noopener noreferrer"
        variant="outline-secondary" className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: "#c8cdd3", borderRadius: 4, height: 50, width: 50 }}>
        <IconifyIcon icon="solar:eye-broken" width={19} height={19} />
      </Button>
      <Button as="a" href={url || "#"} download
        variant="outline-secondary" className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: "#c8cdd3", borderRadius: 4, height: 50, width: 50 }}>
        <IconifyIcon icon="ri:download-line" width={20} height={20} />
      </Button>
    </div>
  </div>
);

const dash = "—";

const TenantDetailsPage = ({ record }) => {
  const td    = record?.tenantDetails ?? {};
  const pers  = td.personalDetails ?? {};
  const cont  = td.contactDetails ?? {};
  const ident = td.identificationDetails ?? {};
  const prof  = td.professionalDetails ?? {};
  const addr  = td.currentAddress ?? {};
  const agr   = td.agreementInformation ?? {};
  const out   = td.outstandingSummary ?? {};
  const docs  = td.tenantDocuments ?? [];

  // Top-level fallbacks
  const tenantName   = record?.tenantName   || pers.tenantName   || dash;
  const mobileNumber = record?.tenantMobileNumber || cont.tenantMobileNumber || dash;
  const email        = record?.tenantEmail   || cont.tenantEmail  || dash;
  const tenantCode   = record?.tenantCode    || pers.tenantCode   || dash;
  const checkOutStatus = record?.checkOutStatus || dash;

  const personalRows = [
    ["Tenant Type",      val(pers.tenantType)       || dash],
    ["Date of Birth",    fmtDate(pers.dateOfBirth)  || dash],
    ["Gender",           val(pers.gender)            || dash],
    ["Civil ID",         val(ident.tenantCivilId)    || dash],
    ["Passport Number",  val(ident.tenantPassportNumber) || dash],
    ["Nationality",      val(pers.tenantNationality) || dash],
    ["Marital Status",   val(pers.maritalStatus)     || dash],
  ].map(([l, v]) => [l, v]);

  const contactRows = [
    ["Mobile Number",       val(cont.tenantMobileNumber)   || dash],
    ["Alternate No",        val(cont.alternateMobileNumber) || dash],
    ["Email",               val(cont.tenantEmail)          || dash],
    ["Address",             val(cont.tenantAddress)        || dash],
    ["Emergency Contact",   cont.emergencyContactName
      ? `${cont.emergencyContactName}\n${cont.emergencyContactNumber || ""}`
      : dash],
  ].map(([l, v]) => [l, v]);

  const agreementRows = [
    ["Agreement ID",       val(agr.agreementId)       || dash],
    ["Agreement Type",     val(agr.agreementType)     || dash],
    ["Start Date",         fmtDate(agr.agreementStartDate) || dash],
    ["End Date",           fmtDate(agr.agreementEndDate)   || dash],
    ["Duration",           val(agr.duration)          || dash],
    ["Rent Amount",        agr.rentAmount ? `${agr.rentAmount} OMR` : dash],
    ["Security Deposit",   agr.securityDeposit ? `${agr.securityDeposit} OMR` : dash],
    ["Payment Frequency",  val(agr.paymentMode)       || dash],
    ["Notice Period",      val(agr.noticePeriod)      || dash],
  ].map(([l, v]) => [l, v]);

  const outstandingRows = [
    ["Outstanding Rent",  out.totalPending   != null ? `${out.totalPending} OMR`  : dash],
    ["Utility Charges",   out.utilityCharges != null ? `${out.utilityCharges} OMR` : dash],
    ["Repair Charges",    val(out.repairCharges)  || "0.00 OMR"],
    ["Other Charges",     val(out.otherCharges)   || "0.00 OMR"],
    ["Total Deductions",  out.totalDeductions != null ? `${out.totalDeductions} OMR` : dash],
  ].map(([l, v]) => [l, v]);

  const additionalRows = [
    ["Profession",        val(prof.profession)       || dash],
    ["Monthly Rent",      agr.rentAmount ? `${agr.rentAmount} OMR` : dash],
    ["Move-Out Reason",   val(record?.moveOutReason) || dash],
    ["Company Name",      val(prof.companyName)      || dash],
    ["Security Deposit",  agr.securityDeposit ? `${agr.securityDeposit} OMR` : dash],
    ["No. Of Occupants",  val(record?.numberOfOccupants) || dash],
  ].map(([l, v]) => [l, v]);

  const addrPhoto = addr.photos?.[0];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "grid", gap: 24, gridTemplateColumns: "minmax(650px, 1.7fr) minmax(430px, 1fr)", overflowX: "auto" }}>
        <div>
          {/* Tenant Details card */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Tenant Details</h5>
            <div style={{ padding: "30px 55px 40px" }}>
              <div className="d-flex align-items-start gap-4 mb-4">
                <div className="d-inline-flex align-items-center justify-content-center"
                  style={{ background: "#eef2f7", borderRadius: "50%", height: 74, width: 74, color: pageText, fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
                  {tenantName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-5 mb-3">
                    <h4 className="mb-0" style={{ color: pageText, fontSize: 23, fontWeight: 700 }}>{tenantName}</h4>
                    <span style={{ color: pageText, fontSize: 15 }}>{checkOutStatus}</span>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-4 mb-2">
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="ri:phone-fill" width={16} height={16} />{mobileNumber}
                    </span>
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="logos:google-gmail" width={16} height={16} />{email}
                    </span>
                  </div>
                  <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                    <IconifyIcon icon="ri:user-location-line" width={16} height={16} />{tenantCode}
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gap: 70, gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <h6 className="mb-4" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Personal &amp; Exit Information</h6>
                  <InfoRows items={personalRows} />
                </div>
                <div style={{ borderLeft: "1px solid #d6dce3", paddingLeft: 72 }}>
                  <h6 className="mb-4" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>Contact &amp; Forwarding Address</h6>
                  <InfoRows items={contactRows} />
                </div>
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Current Address (Rented Unit)</h5>
            <div style={{ alignItems: "center", display: "grid", gap: 28, gridTemplateColumns: "170px 1fr 300px", padding: "26px 30px 22px" }}>
              {addrPhoto ? (
                <img alt={addr.propertyName} src={resolvePhotoSrc(addrPhoto)}
                  style={{ borderRadius: 8, height: 138, objectFit: "cover", width: 164 }} />
              ) : (
                <div style={{ background: "#eef2f7", borderRadius: 8, height: 138, width: 164, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconifyIcon icon="noto:house" width={48} height={48} />
                </div>
              )}
              <div>
                <p className="mb-2" style={{ color: "#5f6470", fontSize: 16, fontWeight: 500 }}>{val(addr.propertyName) || dash}</p>
                <p className="mb-0" style={{ color: "#5f6470", fontSize: 16, lineHeight: 1.55 }}>{val(addr.address) || dash}</p>
              </div>
              <InfoRows items={[
                ["Unit Type", val(addr.unitType) || dash],
                ["Area",      addr.areaSqft ? `${addr.areaSqft} sq.ft` : dash],
                ["Floor",     addr.floor != null ? String(addr.floor) : dash],
              ]} />
            </div>
          </div>

          {/* Additional Information */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Additional Information</h5>
            <div style={{ display: "grid", gap: "18px 34px", gridTemplateColumns: "1fr 1fr 1fr", padding: "24px 24px 22px" }}>
              {additionalRows.map(([label, value], index) => (
                <div key={label} style={{ ...infoRowStyle, borderRight: index % 3 === 2 ? 0 : "1px solid #d6dce3", gridTemplateColumns: "135px 16px 1fr" }}>
                  <span style={{ color: "#5f6470", fontSize: 16 }}>{label}</span>
                  <span style={{ color: "#5f6470", fontSize: 16 }}>:</span>
                  <span style={{ color: "#5f6470", fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Agreement Information */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Agreement Information</h5>
            <div style={{ padding: "24px 74px 24px" }}>
              <InfoRows items={agreementRows} />
            </div>
          </div>

          {/* Outstanding Summary */}
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Outstanding Summary</h5>
            <div style={{ padding: "24px 74px 22px" }}>
              <InfoRows items={outstandingRows} highlightLast />
            </div>
          </div>

          {/* Tenant Documents */}
          <div style={cardStyle}>
            <h5 style={titleStyle}>Tenant Documents</h5>
            <div style={{ padding: "22px 32px 6px" }}>
              {docs.length === 0 ? (
                <p style={{ color: mutedText, fontSize: 15, paddingBottom: 22 }}>No documents uploaded yet.</p>
              ) : (
                docs.map((doc, i) => (
                  <DocumentRow
                    key={doc.documentId ?? i}
                    name={doc.documentName ?? doc.name ?? doc.documentType ?? `Document ${i + 1}`}
                    date={doc.uploadedOn ? `Uploaded on ${fmtDate(doc.uploadedOn)}` : ""}
                    url={doc.file ?? ""}
                  />
                ))
              )}
              <p className="mb-0" style={{ color: mutedText, fontSize: 13, paddingBottom: 22 }}>
                Documents are collected for final check-out verification and settlement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsPage;
