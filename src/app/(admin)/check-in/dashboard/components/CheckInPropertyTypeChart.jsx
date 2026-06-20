import { Card, CardBody } from "react-bootstrap";

const MAX_VALUE = 50;
const CHART_HEIGHT = 258;

const CheckInPropertyTypeChart = ({ data = [] }) => {
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
            padding: "28px 28px 21px",
            borderBottom: "1px solid #e6e8ec",
          }}
        >
          Check-in Property Type
        </h5>

        <div style={{ display: "flex", gap: "14px", padding: "18px 20px 24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              justifyContent: "space-between",
              height: `${CHART_HEIGHT}px`,
              paddingBottom: "28px",
            }}
          >
            {[0, 10, 20, 30, 40].map((v) => (
              <span
                key={v}
                style={{
                  fontSize: "16px",
                  color: "#444",
                  textAlign: "right",
                  lineHeight: 1,
                }}
              >
                {v}
              </span>
            ))}
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: `${CHART_HEIGHT - 28}px`,
                display: "flex",
                flexDirection: "column-reverse",
                justifyContent: "space-between",
                pointerEvents: "none",
              }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{ borderTop: "1px solid #f0f0f0", width: "100%" }}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: `${CHART_HEIGHT - 28}px`,
                position: "relative",
                zIndex: 1,
                padding: "0 12px",
              }}
            >
              {data.map((d) => {
                const barHeight = (d.value / MAX_VALUE) * (CHART_HEIGHT - 28);
                return (
                  <div
                    key={d.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "#374151",
                      }}
                    >
                      {d.value}
                    </span>
                    <div
                      style={{
                        width: "64px",
                        height: `${barHeight}px`,
                        background: `linear-gradient(180deg, ${d.color}, rgba(255,255,255,0.45))`,
                        borderRadius: "12px 12px 0 0",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.05)",
                        transition: "height 0.5s ease",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div
              style={{ borderTop: "1.5px solid #e5e7eb", margin: "0 0 8px" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 12px",
              }}
            >
              {data.map((d) => (
                <span
                  key={d.label}
                  style={{
                    fontSize: "16px",
                    color: "#6f6f6f",
                    textAlign: "center",
                    width: "64px",
                  }}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CheckInPropertyTypeChart;
