// src/app/(admin)/dash/an/components/SocialSource.jsx

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ReactApexChart from 'react-apexcharts';
import {
  Button, Card, CardBody, CardFooter, CardHeader, CardTitle,
  Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row,
} from 'react-bootstrap';
import { useEffect, useRef, useState, useCallback } from 'react';
import { API_BASE_URL, AUTH_TOKEN } from '@/constants/api';
import httpClient from '@/helpers/httpClient';
import { socialOptions } from '../data';
import SalesLocation from './SalesLocation';
import WeeklySales from './WeeklySales';
import { Link } from "react-router-dom";

// ── Helper: filter leads by createdAt ───────────────────────────────────────
function filterLeadsByPeriod(leads = [], period = 'month') {
  const now = new Date();

  return leads.filter((lead) => {
    const createdAt = lead.createdAt || lead.created_at;
    if (!createdAt) return false;
    const date = new Date(createdAt);

    if (period === 'week') {
      // Last 7 days
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo && date <= now;
    }

    if (period === 'month') {
      // Current calendar month
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    }

    if (period === 'year') {
      // Current calendar year
      return date.getFullYear() === now.getFullYear();
    }

    return true;
  });
}

// ── Filter label map ─────────────────────────────────────────────────────────
const FILTER_LABELS = { week: 'This Week', month: 'This Month', year: 'This Year' };

// ── Main Card ────────────────────────────────────────────────────────────────
const SocialSourceCard = () => {
  const colRef = useRef(null);
  const [chartWidth,   setChartWidth]   = useState(undefined);
  const [activePeriod, setActivePeriod] = useState('month');   // week | month | year
  const [allLeads,     setAllLeads]     = useState([]);        // all leads (total + tenant)
  const [allTenants,   setAllTenants]   = useState([]);        // tenant-only leads
  const [loading,      setLoading]      = useState(true);

  // ── Resize observer for chart width ────────────────────────────────────────
  useEffect(() => {
    if (!colRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setChartWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(colRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Fetch ALL leads once on mount ──────────────────────────────────────────
  useEffect(() => {
    const headers = { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: 'application/json' };

    Promise.all([
      httpClient.get(`${API_BASE_URL}/lead/get_all/`, { headers }),
      httpClient.get(`${API_BASE_URL}/lead/get_all/?filter_key=purpose&filter_value=tenant`, { headers }),
    ])
      .then(([totalRes, tenantRes]) => {
        const total  = totalRes.data?.data?.data  || totalRes.data?.data  || [];
        const tenant = tenantRes.data?.data?.data || tenantRes.data?.data || [];
        setAllLeads(Array.isArray(total)  ? total  : []);
        setAllTenants(Array.isArray(tenant) ? tenant : []);
      })
      .catch((err) => console.error('SocialSource fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Derived counts based on selected period ────────────────────────────────
  const filteredTotal   = filterLeadsByPeriod(allLeads,   activePeriod);
  const filteredTenants = filterLeadsByPeriod(allTenants, activePeriod);

  const totalLeads  = filteredTotal.length;
  const tenantCount = filteredTenants.length;

  // ── Radial chart: show percentage of tenants out of total ─────────────────
  const radialValue = totalLeads > 0 ? Math.round((tenantCount / totalLeads) * 100) : 0;
  const dynamicSocialOptions = {
    ...socialOptions,
    series: [radialValue],
  };

  return (
    <Col xl={3} lg={6}>
      <Card style={{ height: '510px' }}>
        <CardHeader className="d-flex justify-content-between align-items-center pb-1">
          <div>
            <CardTitle as="h4" className="mb-1">Tenant Traffic</CardTitle>
            <p className="fs-13 mb-0">Total Traffic In {FILTER_LABELS[activePeriod]}</p>
          </div>

          {/* ── Filter Dropdown ── */}
          <Dropdown>
            <DropdownToggle
              as="a"
              className="btn btn-sm btn-outline-light rounded content-none icons-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {FILTER_LABELS[activePeriod]}{' '}
              <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem onClick={() => setActivePeriod('week')}>Week</DropdownItem>
              <DropdownItem onClick={() => setActivePeriod('month')}>Month</DropdownItem>
              <DropdownItem onClick={() => setActivePeriod('year')}>Year</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>

        <CardBody>
          <div ref={colRef} style={{ overflow: 'hidden' }}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
                <span className="text-muted fs-14">Loading...</span>
              </div>
            ) : (
              <ReactApexChart
                options={dynamicSocialOptions}
                series={dynamicSocialOptions.series}
                height={chartWidth ? Math.min(380, chartWidth) : 380}
                width={chartWidth || '100%'}
                type="radialBar"
                className="apex-charts"
              />
            )}
          </div>

          <p className="mb-0 mt-3 fs-18 fw-medium text-dark">
            <IconifyIcon icon="ri:group-fill" /> Total Leads:{' '}
            <span className="text-primary fw-bold">{totalLeads.toLocaleString()}</span>
          </p>
          <p className="mb-0 mt-1 fs-16 fw-medium text-dark">
            <IconifyIcon icon="ri:group-fill" /> Tenants:{' '}
            <span className="text-primary fw-bold">{tenantCount.toLocaleString()}</span>
          </p>
        </CardBody>

        <CardFooter className="border-top d-flex align-items-center justify-content-between">
  <h5 className="mb-0"></h5>

  <Link to="/list">
    <Button variant="primary" size="sm">
      See Details
    </Button>
  </Link>

</CardFooter>
      </Card>
    </Col>
  );
};

// ── Wrapper ──────────────────────────────────────────────────────────────────
const SocialSource = ({ counts = {}, loading = false }) => {
  return (
    <Row>
      <SocialSourceCard />
      <SalesLocation />
      <WeeklySales
        weeklyProperties={counts.weeklyProperties ?? []}
        totalRented={counts.totalRented           ?? 0}
        dailyRentedData={counts.dailyRentedData   ?? [0, 0, 0, 0, 0, 0, 0]}
        loading={loading}
      />
    </Row>
  );
};

export default SocialSource;