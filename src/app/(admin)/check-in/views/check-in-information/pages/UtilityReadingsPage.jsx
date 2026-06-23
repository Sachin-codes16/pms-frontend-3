import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { fmtMoney, val } from '@/utils/checkInFormat';

const pageText = '#526b89';
const bodyText = '#303746';

const cardStyle = {
  border: '1px solid #cfd7df',
  borderRadius: 8,
  overflow: 'hidden',
};

const titleStyle = {
  color: pageText,
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  padding: '22px 30px',
};

const emptyTextStyle = { color: pageText, fontSize: 15, padding: '0 30px 24px' };

const STAT_FIELDS = [
  { key: 'totalUtilities', label: 'Total Utilities', icon: 'solar:calendar-date-bold-duotone', color: '#6747ff', bg: '#eee7ff' },
  { key: 'totalUnits', label: 'Total Units', icon: 'solar:gallery-check-bold-duotone', color: '#47c878', bg: '#e9f8ef' },
  { key: 'totalCurrentCharge', label: 'Total Current Charge', icon: 'solar:user-plus-bold-duotone', color: '#ff8d3c', bg: '#fff0e8', money: true },
  { key: 'adjustment', label: 'Adjustment', icon: 'solar:chart-2-bold-duotone', color: '#36c8cf', bg: '#e8fbfb', money: true },
  { key: 'notApplicable', label: 'Not Applicable', icon: 'solar:chart-bold-duotone', color: '#dc3a3a', bg: '#fdeced' },
];

const StatCard = ({ label, value, icon, color, bg }) => (
  <div
    style={{
      alignItems: 'center',
      background: '#fff',
      borderRadius: 5,
      boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      minHeight: 98,
      padding: '20px 20px',
    }}
  >
    <div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span style={{ color: pageText, fontSize: 15 }}>{label}</span>
      </div>
      <strong style={{ color: bodyText, fontSize: 26 }}>{value}</strong>
    </div>
    <span
      className="d-inline-flex align-items-center justify-content-center"
      style={{ background: bg, borderRadius: 5, color, height: 56, width: 56 }}
    >
      <IconifyIcon icon={icon} width={32} height={32} />
    </span>
  </div>
);

const UtilityReadingsPage = ({ record }) => {
  const utilityReadings = record?.utilityReadings ?? {};
  const summary = utilityReadings.summary ?? {};
  const readingsList = utilityReadings.readingsList ?? [];
  const utilitiesOverview = utilityReadings.utilitiesOverview ?? {};
  const readingOverview = utilityReadings.readingOverview ?? [];

  const overviewItems = [
    ['Total Payable', fmtMoney(utilitiesOverview.totalPayable)],
    ['Total Utilities', val(utilitiesOverview.totalUtilities)],
    ['Total Units', val(utilitiesOverview.totalUnits)],
    ['Total Current Charge', fmtMoney(utilitiesOverview.totalCurrentCharge)],
    ['Not Applicable', val(utilitiesOverview.notApplicable)],
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#edf2f8', borderRadius: 8, marginBottom: 24, padding: '26px 25px' }}>
        <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(5, minmax(190px, 1fr))' }}>
          {STAT_FIELDS.map((stat) => (
            <StatCard
              key={stat.key}
              {...stat}
              value={stat.money ? fmtMoney(summary[stat.key] ?? 0) : summary[stat.key] ?? 0}
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'minmax(650px, 1.7fr) minmax(390px, 1fr)' }}>
        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Check-In Utilities Readings</h5>

            {readingsList.length > 0 ? (
              <div style={{ padding: '34px 18px 16px' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#fbfcfd' }}>
                      {['Utility', 'Meter No', 'Check-In Reading', 'Consumption', 'Unit', 'Rate/Unit', 'Charges', 'Status'].map((head) => (
                        <th key={head} style={{ color: pageText, fontSize: 16, fontWeight: 700, padding: '20px 18px', textAlign: 'left' }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {readingsList.map((row, index) => (
                      <tr key={row.id ?? index}>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>
                          <IconifyIcon icon="ri:checkbox-circle-line" width={16} height={16} style={{ color: '#2f7ee6', marginRight: 12 }} />
                          {val(row.utility)}
                        </td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{val(row.meterNo)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{val(row.checkInReading)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{val(row.consumption)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{val(row.unit)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{fmtMoney(row.ratePerUnit)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{fmtMoney(row.charges)}</td>
                        <td style={{ color: pageText, fontSize: 15, padding: '16px 18px' }}>{val(row.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={emptyTextStyle}>No utility readings recorded</p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4" style={cardStyle}>
            <h5 style={titleStyle}>Utilities Overview</h5>
            <div style={{ padding: '22px 70px 28px' }}>
              {overviewItems.map(([label, value]) => (
                <div key={label} style={{ display: 'grid', gridTemplateColumns: '210px 20px 1fr', minHeight: 45 }}>
                  <span style={{ color: pageText, fontSize: 16 }}>{label}</span>
                  <span style={{ color: pageText, fontSize: 16 }}>:</span>
                  <span style={{ color: pageText, fontSize: 16 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <h5 style={titleStyle}>Check-In Reading Overview</h5>
            {readingOverview.length > 0 ? (
              <div style={{ padding: '18px 58px 32px' }}>
                {readingOverview.map((item, index) => (
                  <div key={item.utility ?? index} style={{ alignItems: 'center', display: 'grid', gap: 18, gridTemplateColumns: '140px 1fr 70px', minHeight: 45 }}>
                    <span style={{ color: pageText, fontSize: 16 }}>{val(item.utility)}</span>
                    <span style={{ background: '#d7d7d7', borderRadius: 999, display: 'block', height: 7, overflow: 'hidden' }}>
                      <span style={{ background: item.color ?? '#545579', borderRadius: 999, display: 'block', height: '100%', width: `${item.percentage ?? 0}%` }} />
                    </span>
                    <span style={{ color: pageText, fontSize: 15, textAlign: 'right' }}>{fmtMoney(item.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={emptyTextStyle}>No reading data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilityReadingsPage;
