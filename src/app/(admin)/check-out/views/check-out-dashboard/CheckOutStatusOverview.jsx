import { useRef, useState } from 'react';
import { Card, CardBody } from 'react-bootstrap';

const DonutChart = ({ data, size = 198, thickness = 44 }) => {
  const wrapperRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleMove = (slice) => (e) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    setHovered({ ...slice, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (total <= 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e9ecef" strokeWidth={thickness} />
      </svg>
    );
  }

  let offset = 0;

  const slices = data.map((item) => {
    const dash = (item.value / total) * circumference;
    const slice = { ...item, dash, gap: circumference - dash, offset };
    offset += dash;
    return slice;
  });

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {slices.map((slice) => (
          <circle
            key={slice.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={thickness}
            strokeDasharray={`${slice.dash} ${slice.gap}`}
            strokeDashoffset={-slice.offset}
            onMouseMove={handleMove(slice)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            left: hovered.x + 12,
            top: hovered.y + 12,
            background: '#1f2937',
            color: '#fff',
            borderRadius: 6,
            padding: '8px 12px',
            fontSize: 13,
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{hovered.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: hovered.color, display: 'inline-block' }} />
            <span>{hovered.display}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckOutStatusOverview = ({ data = [] }) => (
  <Card className="border-0 shadow-sm h-100 w-100" style={{ borderRadius: 8, overflow: 'hidden' }}>
    <CardBody style={{ padding: 0 }}>
      <h5 className="mb-0" style={{ color: '#526b89', fontWeight: 700, fontSize: 18, padding: '28px 18px 21px', borderBottom: '1px solid #e6e8ec' }}>
        Check-Out Status Overview
      </h5>

      <div className="d-flex flex-wrap align-items-center gap-4" style={{ padding: '56px 18px 32px' }}>
        <div style={{ flexShrink: 0 }}>
          <DonutChart data={data} />
        </div>

        <div className="d-flex flex-column gap-3">
          {data.map((item) => (
            <div key={item.label} className="d-flex align-items-center gap-2">
              <span style={{ width: 15, height: 15, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 16, color: '#7a8da5', minWidth: 124, fontWeight: 600 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 16, fontWeight: 500, color: '#222' }}>{item.display}</span>
            </div>
          ))}
        </div>
      </div>
    </CardBody>
  </Card>
);

export default CheckOutStatusOverview;
