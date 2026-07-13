import React, { useState } from 'react';
import { Card, CardBody } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { recentCheckIns, recentCheckOuts } from './checkInData';

const RecentCheckInOuts = () => {
  const [activeTab, setActiveTab] = useState('check-outs');

  return (
    <Card className="shadow-sm border-0 mb-4 h-100" style={{ borderRadius: '8px' }}>
      <div className="card-header bg-transparent p-0 border-bottom">
        <div className="d-flex" style={{ paddingLeft: '1.5rem', minHeight: '54px' }}>
          <button
            className={`btn btn-link text-decoration-none py-2 px-3 position-relative fw-semibold border-0 ${
              activeTab === 'check-ins' ? 'text-primary' : 'text-muted'
            }`}
            onClick={() => setActiveTab('check-ins')}
            style={{
              color: activeTab === 'check-ins' ? '#604ae3' : '#8a99ad',
              outline: 'none',
              boxShadow: 'none',
              fontSize: '17px'
            }}
          >
            Recent Check-Ins
            {activeTab === 'check-ins' && (
              <span
                className="position-absolute bottom-0 start-0 w-100"
                style={{
                  height: '3px',
                  backgroundColor: '#604ae3',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px'
                }}
              />
            )}
          </button>
          <button
            className={`btn btn-link text-decoration-none py-2 px-3 position-relative fw-semibold border-0 ms-2 ${
              activeTab === 'check-outs' ? 'text-primary' : 'text-muted'
            }`}
            onClick={() => setActiveTab('check-outs')}
            style={{
              color: activeTab === 'check-outs' ? '#604ae3' : '#8a99ad',
              outline: 'none',
              boxShadow: 'none',
              fontSize: '17px'
            }}
          >
            Recent Check-Outs
            {activeTab === 'check-outs' && (
              <span
                className="position-absolute bottom-0 start-0 w-100"
                style={{
                  height: '3px',
                  backgroundColor: '#604ae3',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px'
                }}
              />
            )}
          </button>
        </div>
      </div>

      <CardBody style={{ padding: '20px 16px 0' }}>
        <div className="table-responsive border" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <table className="table align-middle text-nowrap table-hover table-centered mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#fbfcfe' }}>
              <tr>
                <th className="py-2" style={{ paddingLeft: '1.25rem', color: '#516986', fontWeight: '600', fontSize: '15px' }}>
                  {activeTab === 'check-ins' ? 'Check-In ID' : 'Check-Out ID'}
                </th>
                <th className="py-2" style={{ color: '#516986', fontWeight: '600', fontSize: '15px' }}>Tenant Name</th>
                <th className="py-2" style={{ color: '#516986', fontWeight: '600', fontSize: '15px' }}>Property</th>
                <th className="py-2" style={{ color: '#516986', fontWeight: '600', fontSize: '15px' }}>
                  {activeTab === 'check-ins' ? 'Check-In Date' : 'Check-Out Date'}
                </th>
                <th className="py-2" style={{ color: '#516986', fontWeight: '600', fontSize: '15px' }}>Status</th>
                <th className="py-2" style={{ paddingRight: '1.25rem', color: '#516986', fontWeight: '600', fontSize: '15px' }}>
                  {activeTab === 'check-ins' ? 'Assigned To' : 'Days Left'}
                </th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'check-ins'
                ? recentCheckIns.map((item, idx) => (
                    <tr key={idx} className="border-bottom border-light">
                      <td className="py-2" style={{ paddingLeft: '1.25rem', color: '#516986', fontSize: '14px' }}>
                        {item.id}
                      </td>
                      <td className="py-2">
                        <span className="fw-medium" style={{ color: '#516986', fontSize: '14px' }}>
                          {item.tenantName}
                        </span>
                      </td>
                      <td className="py-2" style={{ color: '#6f829d', fontSize: '14px' }}>{item.property}</td>
                      <td className="py-2" style={{ color: '#6f829d', fontSize: '14px' }}>{item.date}</td>
                      <td className="py-2">
                        <span
                          style={{
                            color:
                              item.status === 'Completed'
                                ? '#47ad94'
                                : item.status === 'In Progress'
                                ? '#604ae3'
                                : '#ff9b43',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2" style={{ paddingRight: '1.25rem', color: '#6f829d', fontSize: '14px' }}>
                        {item.assignedTo}
                      </td>
                    </tr>
                  ))
                : recentCheckOuts.map((item, idx) => (
                    <tr key={idx} className="border-bottom border-light">
                      <td className="py-2" style={{ paddingLeft: '1.25rem', color: '#516986', fontSize: '14px' }}>
                        {item.id}
                      </td>
                      <td className="py-2">
                        <span className="fw-medium" style={{ color: '#516986', fontSize: '14px' }}>
                          {item.tenantName}
                        </span>
                      </td>
                      <td className="py-2" style={{ color: '#6f829d', fontSize: '14px' }}>{item.property}</td>
                      <td className="py-2" style={{ color: '#6f829d', fontSize: '14px' }}>{item.date}</td>
                      <td className="py-2">
                        <span
                          style={{
                            color:
                              item.status === 'Completed'
                                ? '#47ad94'
                                : item.status === 'In Progress'
                                ? '#604ae3'
                                : '#ff9b43',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2" style={{ paddingRight: '1.25rem', color: '#6f829d', fontSize: '14px' }}>
                        {item.daysLeft}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-transparent border-0 py-2 text-center">
          <Link
            to={activeTab === 'check-ins' ? '/check-in-list' : '/check-out-list'}
            className="fw-semibold text-decoration-none fs-14 transition-all"
            style={{ color: '#604ae3', cursor: 'pointer' }}
          >
            {activeTab === 'check-ins' ? 'View All Check-Ins' : 'View All Check-Outs'}
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentCheckInOuts;
