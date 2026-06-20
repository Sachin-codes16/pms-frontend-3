import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { Button } from "react-bootstrap";

const pageText = "#526b89";
const bodyText = "#263244";
const mutedText = "#69798c";

const cardStyle = {
  border: "1px solid #dfe5eb",
  borderRadius: 8,
  overflow: "hidden",
};

const titleStyle = {
  background: "#fbfcfd",
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: "22px 32px 18px",
};

const infoRowStyle = {
  alignItems: "start",
  display: "grid",
  gridTemplateColumns: "150px 18px 1fr",
  minHeight: 40,
};

const tenantProfile = [
  ["Tenant Type", "Individual"],
  ["Move-In Date", "18 March 2024"],
  ["Check-Out Date", "29 May 2025"],
  ["Civil ID", "CVG-21-564"],
  ["Passport Number", "95615616115"],
  ["Nationality", "Oman"],
  ["Exit Status", "Notice Served"],
];

const contactInfo = [
  ["Mobile Number", "+91 1234567890"],
  ["Alternate No", "+91 9876543210"],
  ["Email", "bilalahmed@gmail.com"],
  ["Forwarding Address", "188/11, South West\nBoag Road, T Beside\nMuscat Oman"],
  ["Emergency No", "Ahmed Khan (Brother)\n+91 1234567890"],
];

const agreementInfo = [
  ["Agreement ID", "AGR-2504-OM"],
  ["Agreement Type", "Residential Lease"],
  ["Start Date", "18 Mar 2024"],
  ["End Date", "29 May 2025"],
  ["Duration", "14 Months"],
  ["Rent Amount", "550.00 OMR"],
  ["Security Deposit", "130.00 OMR"],
  ["Payment Frequency", "Monthly"],
  ["Notice Period", "30 Days"],
];

const outstandingInfo = [
  ["Outstanding Rent", "250.00 OMR"],
  ["Utility Charges", "150.00 OMR"],
  ["Repair Charges", "52.00 OMR"],
  ["Other Charges", "0.00 OMR"],
  ["Total Deductions", "452.00 OMR"],
];

const additionalInfo = [
  ["Profession", "IT Consultant"],
  ["Deposit Held", "500.00 OMR"],
  ["Move-Out Reason", "Work Relocation"],
  ["Company Name", "Tech Solutions LLC"],
  ["Refund Amount", "48.00 OMR"],
  ["No. Of Occupants", "3"],
];

const documents = [
  ["Civil ID.pdf", "Uploaded on 15 April 2026"],
  ["Passport.pdf", "Uploaded on 15 April 2026"],
  ["Exit Inspection.pdf", "Uploaded on 29 May 2026"],
  ["Deposit Settlement.pdf", "Uploaded on 29 May 2026"],
];

const InfoRows = ({ items, highlightLast = false }) => (
  <div>
    {items.map(([label, value], index) => {
      const isHighlighted = highlightLast && index === items.length - 1;

      return (
        <div key={label} style={infoRowStyle}>
          <span style={{ color: pageText, fontSize: 16, fontWeight: isHighlighted ? 700 : 400 }}>
            {label}
          </span>
          <span style={{ color: pageText, fontSize: 16 }}>:</span>
          <span
            style={{
              color: pageText,
              fontSize: 16,
              fontWeight: isHighlighted ? 700 : 400,
              whiteSpace: "pre-line",
            }}
          >
            {value}
          </span>
        </div>
      );
    })}
  </div>
);

const DocumentRow = ({ name, date }) => (
  <div className="d-flex align-items-center justify-content-between gap-3" style={{ marginBottom: 24 }}>
    <div className="d-flex align-items-center gap-4">
      <span
        className="d-inline-flex align-items-center justify-content-center"
        style={{
          border: "1px solid #9aa3ad",
          borderRadius: 5,
          height: 50,
          width: 50,
        }}
      >
        <IconifyIcon icon="vscode-icons:file-type-pdf2" width={28} height={28} />
      </span>
      <div>
        <p className="mb-1" style={{ color: bodyText, fontSize: 16, fontWeight: 600 }}>
          {name}
        </p>
        <p className="mb-0" style={{ color: bodyText, fontSize: 14 }}>
          {date}
        </p>
      </div>
    </div>

    <div className="d-flex gap-3">
      <Button
        variant="outline-secondary"
        className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: "#c8cdd3", borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="solar:eye-broken" width={19} height={19} />
      </Button>
      <Button
        variant="outline-secondary"
        className="d-inline-flex align-items-center justify-content-center p-0"
        style={{ borderColor: "#c8cdd3", borderRadius: 4, height: 50, width: 50 }}
      >
        <IconifyIcon icon="ri:download-line" width={20} height={20} />
      </Button>
    </div>
  </div>
);

const TenantDetailsPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "minmax(650px, 1.7fr) minmax(430px, 1fr)",
          overflowX: "auto",
        }}
      >
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Tenant Details</h5>

            <div style={{ padding: "30px 55px 40px" }}>
              <div className="d-flex align-items-start gap-4 mb-4">
                <img
                  alt="Bilal Ahmed"
                  src="https://i.pravatar.cc/120?img=12"
                  style={{ borderRadius: "50%", height: 74, objectFit: "cover", width: 74 }}
                />
                <div>
                  <div className="d-flex align-items-center gap-5 mb-3">
                    <h4 className="mb-0" style={{ color: pageText, fontSize: 23, fontWeight: 700 }}>
                      Bilal Ahmed
                    </h4>
                    <span style={{ color: pageText, fontSize: 15 }}>Check-Out In Progress</span>
                  </div>
                  <div className="d-flex flex-wrap align-items-center gap-4 mb-2">
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="ri:phone-fill" width={16} height={16} />
                      +911 1234567890
                    </span>
                    <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                      <IconifyIcon icon="logos:google-gmail" width={16} height={16} />
                      bilalahmed@gmail.com
                    </span>
                  </div>
                  <span className="d-inline-flex align-items-center gap-2" style={{ color: pageText, fontSize: 15 }}>
                    <IconifyIcon icon="ri:user-location-line" width={16} height={16} />
                    TNT-1245-4698
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gap: 70, gridTemplateColumns: "1fr 1fr" }}>
                <div>
                  <h6 className="mb-4" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                    Personal & Exit Information
                  </h6>
                  <InfoRows items={tenantProfile} />
                </div>

                <div style={{ borderLeft: "1px solid #d6dce3", paddingLeft: 72 }}>
                  <h6 className="mb-4" style={{ color: pageText, fontSize: 16, fontWeight: 700 }}>
                    Contact & Forwarding Address
                  </h6>
                  <InfoRows items={contactInfo} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Current Address (Rented Unit)</h5>
            <div
              style={{
                alignItems: "center",
                display: "grid",
                gap: 28,
                gridTemplateColumns: "170px 1fr 300px",
                padding: "26px 30px 22px",
              }}
            >
              <img
                alt="Ocean View Residency"
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=340&q=80"
                style={{ borderRadius: 8, height: 138, objectFit: "cover", width: 164 }}
              />
              <div>
                <p className="mb-2" style={{ color: "#5f6470", fontSize: 16, fontWeight: 500 }}>
                  Ocean View Residency
                </p>
                <p className="mb-0" style={{ color: "#5f6470", fontSize: 16, lineHeight: 1.55 }}>
                  A-101, Ocean View Residency, Muscat, Al Reem Island, Oman 1230285
                </p>
              </div>
              <InfoRows
                items={[
                  ["Unit Type", "4 BHK"],
                  ["Area", "1250 sq.ft"],
                  ["Floor", "4th Floor"],
                ]}
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Additional Information</h5>
            <div
              style={{
                display: "grid",
                gap: "18px 34px",
                gridTemplateColumns: "1fr 1fr 1fr",
                padding: "24px 24px 22px",
              }}
            >
              {additionalInfo.map(([label, value], index) => (
                <div
                  key={label}
                  style={{
                    ...infoRowStyle,
                    borderRight: index % 3 === 2 ? 0 : "1px solid #d6dce3",
                    gridTemplateColumns: "135px 16px 1fr",
                  }}
                >
                  <span style={{ color: "#5f6470", fontSize: 16 }}>{label}</span>
                  <span style={{ color: "#5f6470", fontSize: 16 }}>:</span>
                  <span style={{ color: "#5f6470", fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Agreement Information</h5>
            <div style={{ padding: "24px 74px 24px" }}>
              <InfoRows items={agreementInfo} />
            </div>
          </div>

          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Outstanding Summary</h5>
            <div style={{ padding: "24px 74px 22px" }}>
              <InfoRows items={outstandingInfo} highlightLast />
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Tenant Documents</h5>
            <div style={{ padding: "22px 32px 6px" }}>
              {documents.map(([name, date]) => (
                <DocumentRow key={name} name={name} date={date} />
              ))}
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
