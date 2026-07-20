import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import PropertyAdd from './components/PropertyAdd';
import PropertyAddCard from './components/PropertyAddCard';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import httpClient from '@/helpers/httpClient';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';

const AssignmentPropertyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tenantData, setTenantData] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeTenantData = () => {
      try {
        // ✅ OPTION 1: Lead object passed directly from LeadList
        if (location.state?.lead) {
          console.log('✅ Using lead object from navigation state:', location.state.lead);
          setTenantData(location.state.lead);
          setLoading(false);
          return;
        }

        // ✅ OPTION 2: Only leadId passed, need to fetch from API
        const leadId = location.state?.leadId;
        
        if (leadId) {
          console.log('🔍 Fetching lead data for leadId:', leadId);
          fetchTenantData(leadId);
          return;
        }

        // ❌ No data provided
        console.error('❌ No lead data or leadId provided in location.state');
        console.log('Location state:', location.state);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error initializing tenant data:', error);
        setLoading(false);
      }
    };

    const fetchTenantData = async (leadId) => {
      try {
        const response = await httpClient.get(`${API_BASE_URL}/lead/get_all/`, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📥 API Response:', response.data);

        if (response.data?.status && response.data?.data?.data) {
          const allLeads = response.data.data.data;
          const tenant = allLeads.find(lead => lead.leadId === leadId);
          
          if (tenant) {
            console.log('✅ Tenant found:', tenant);
            setTenantData(tenant);
          } else {
            console.error('❌ Tenant not found with leadId:', leadId);
            console.log('Available leadIds:', allLeads.map(l => l.leadId));
          }
        }
      } catch (error) {
        console.error('❌ Error fetching tenant data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeTenantData();
  }, [location.state]);

  return (
    <>
      <PageTitle title="Assign Property" subName="" />
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading tenant data...</p>
        </div>
      ) : (
        <Row>
          <Col xl={3} lg={4}>
            <PropertyAddCard selectedProperty={selectedProperty} />
          </Col>
          <Col xl={9} lg={8}>
            <PropertyAdd 
              tenantData={tenantData} 
              onPropertySelect={setSelectedProperty}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

export default AssignmentPropertyPage;