import PageTitle from '@/components/PageTitle';
import TotalLeadList from './components/Totalleadlist';
import { useState } from 'react';

const TotalLeadsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <PageTitle title="New Lead List" subName="All Leads" />

      {/* Search bar */}
      <div className="mb-3">
        <div style={{ maxWidth: '360px', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, contact, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: '#F9F9FC',
              border         : '1.5px solid #c6c6c6',
              borderRadius   : '8px',
              paddingLeft    : '36px',
              fontWeight     : '500',
            }}
          />
          <span
            style={{
              position : 'absolute',
              left     : '10px',
              top      : '50%',
              transform: 'translateY(-50%)',
              color    : '#999',
            }}
          >
            🔍
          </span>
        </div>
      </div>

      <TotalLeadList searchQuery={searchQuery} />
    </>
  );
};

export default TotalLeadsPage;