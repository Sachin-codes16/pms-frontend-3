
import { useState } from 'react';

const NotificationDropdownWithDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const unreadNotifications = [
    {
      id: 1,
      content: "A customer from Muscat submitted an inquiry for Al Mouj Seaside Apartment. Assign to team?"
    },
    {
      id: 2,
      content: "Your Google Ads — Muscat Luxury Rentals campaign reached 75% of today's limit."
    },
    {
      id: 3,
      content: "Lead #OM-2374 reopened the Azaiba Villas brochure twice in the past hour."
    }
  ];

  const previousNotifications = [
    {
      id: 4,
      content: "Qurum Heights Residence gained 95 new views today across digital channels."
    },
    {
      id: 5,
      content: "Only 1 townhouse remaining in Madinat Al Irfan Phase 2. Consider boosting visibility."
    },
    {
      id: 6,
      content: "Search interest for family villas in Seeb surged this week. Suggested ad update ready."
    },
    {
      id: 7,
      content: "You have 4 Omani leads awaiting follow-up in the last 24 hours."
    },
    {
      id: 8,
      content: "Al Khoudh Modern Apartments has been successfully published on all marketing platforms."
    }
  ];

  return (
    <>
      {/* Notification Bell Button - Aapki topbar mein ye jayega */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
          }}
        >
          <svg 
            width="20" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ color: '#6b7280' }}
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            3
          </span>
        </button>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9998,
            transition: 'opacity 0.3s'
          }}
        />
      )}

      {/* Drawer - Right Side Panel */}
      <div
        style={{
          position: 'fixed',
          top: 10,
          right: isDrawerOpen ? 0 : '-420px',
          width: '420px',
          maxWidth: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-4px 0 10px rgba(0,0,0,0.1)',
          zIndex: 9999,
          transition: 'right 0.2s ease-in-out',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header - Sticky */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>
            Notifications
          </h1>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '28px',
              color: '#6b7280',
              padding: 0,
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{ padding: '20px', flex: 1 }}>
          {/* Unread Notifications */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Unread Notifications
            </h2>
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: '#c8f4d4',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#1a1a1a',
                    lineHeight: '1.6',
                    fontWeight: '400'
                  }}>
                    {notification.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Previous Notifications */}
          <div>
            <h2 style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Previous Notifications
            </h2>
            {previousNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  backgroundColor: '#e8e8e8',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '12px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    fontWeight: '400'
                  }}>
                    {notification.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdownWithDrawer;