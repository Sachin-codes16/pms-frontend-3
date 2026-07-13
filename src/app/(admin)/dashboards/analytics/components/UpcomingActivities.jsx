import React from 'react';
import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const UpcomingActivities = () => {
  const activities = [
    {
      title: 'Check-In : New Tenant',
      subtitle: 'Ali Rehman | Unit A-502',
      date: '02 June 2026',
      time: '10:00 AM',
      icon: 'fluent-emoji-flat:spiral-calendar',
      iconSize: 26
    },
    {
      title: 'Check-Out : Move Out',
      subtitle: 'Sara Khan | Unit B-201',
      date: '02 June 2026',
      time: '11:00 AM',
      icon: 'fluent-emoji-flat:house-with-garden',
      iconSize: 27
    },
    {
      title: 'Inspection Scheduled',
      subtitle: 'Unit C-201',
      date: '02 June 2026',
      time: '12:00 AM',
      icon: 'noto:house',
      iconSize: 27
    },
    {
      title: 'Key Handover',
      subtitle: 'Unit C-303',
      date: '02 June 2026',
      time: '14:00 AM',
      icon: 'fluent-emoji-flat:key',
      iconSize: 28
    },
    {
      title: 'Maintenance Request',
      subtitle: 'Unit D-410',
      date: '02 June 2026',
      time: '15:00 AM',
      icon: 'flat-color-icons:ok',
      iconSize: 28
    }
  ];

  return (
    <Card className="shadow-sm border-0 mb-4 h-100" style={{ borderRadius: '8px' }}>
      <CardHeader
        className="border-0"
        style={{
          backgroundColor: '#fbfcfe',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          padding: '18px 32px 14px'
        }}
      >
        <CardTitle as="h4" className="mb-0 fw-semibold" style={{ color: '#516986', fontSize: '15px' }}>
          Upcoming Activities
        </CardTitle>
      </CardHeader>
      <CardBody className="d-flex flex-column" style={{ padding: '4px 36px 6px 32px' }}>
        <div className="d-flex flex-column justify-content-between flex-grow-1">
          {activities.map((item, idx) => (
            <div
              key={idx}
              className="d-flex align-items-center justify-content-between"
              style={{
                borderBottom: '1px solid #d8e2ef',
                padding: '13px 0 12px'
              }}
            >
              <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '26px',
                    height: '28px',
                    marginRight: '13px'
                  }}
                >
                  <IconifyIcon icon={item.icon} width={item.iconSize} height={item.iconSize} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <h6 className="mb-1 fw-medium text-truncate" style={{ color: '#516986', fontSize: '16px' }}>
                    {item.title}
                  </h6>
                  <span className="d-block text-truncate" style={{ color: '#7488a4', fontSize: '13px' }}>
                    {item.subtitle}
                  </span>
                </div>
              </div>

              <div className="text-end flex-shrink-0 ms-3" style={{ minWidth: '120px' }}>
                <div className="fw-medium" style={{ color: '#4f739e', fontSize: '15px' }}>
                  {item.date}
                </div>
                <div style={{ color: '#4f739e', fontSize: '15px' }}>{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default UpcomingActivities;
