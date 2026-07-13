import { Card, CardBody } from "react-bootstrap";

const DOT_SIZE = 20;
const ROW_GAP = 32;

const CheckInWorkflow = ({ steps = [] }) => {
  return (
    <Card
      className="shadow-sm border-0 h-100 w-100"
      style={{ borderRadius: 10, minHeight: 400, overflow: "hidden" }}
    >
      <CardBody style={{ padding: 0 }}>
        <h5
          className="mb-0"
          style={{
            color: "#526b89",
            fontWeight: 700,
            fontSize: 18,
            padding: "28px 38px 21px",
            borderBottom: "1px solid #e6e8ec",
          }}
        >
          Check-in Workflow
        </h5>

        <div style={{ padding: "47px 76px 32px", display: "flex", gap: 24 }}>
          {/* Left: dots + line */}
          <div style={{ position: "relative", width: DOT_SIZE, flexShrink: 0 }}>
            {steps.map((step, i) => (
              <div key={step.label}>
                {/* Line between dots */}
                {i < steps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: DOT_SIZE / 2 - 1,
                      top: i * (DOT_SIZE + ROW_GAP) + DOT_SIZE,
                      width: 2,
                      height: ROW_GAP,
                      background: "#d8dce8",
                    }}
                  />
                )}
                {/* Dot */}
                <div
                  style={{
                    position: "absolute",
                    top: i * (DOT_SIZE + ROW_GAP),
                    left: 0,
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: "50%",
                    background: step.dotColor,
                    zIndex: 1,
                  }}
                />
              </div>
            ))}
            {/* spacer so parent has height */}
            <div
              style={{
                height: steps.length * (DOT_SIZE + ROW_GAP) - ROW_GAP,
              }}
            />
          </div>

          {/* Right: labels + values */}
          <div style={{ flex: 1 }}>
            {steps.map((step, i) => (
              <div
                key={step.label}
                className="d-flex align-items-center justify-content-between"
                style={{
                  height: DOT_SIZE,
                  marginBottom: i < steps.length - 1 ? ROW_GAP : 0,
                }}
              >
                <span
                  style={{ color: "#526b89", fontSize: 16, fontWeight: 600 }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    color: step.valueColor,
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {step.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CheckInWorkflow;
