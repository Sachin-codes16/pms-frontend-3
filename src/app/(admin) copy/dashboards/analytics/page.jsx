import PageTitle from '@/components/PageTitle';
import SocialSource from './components/SocialSource';
import Statistics from './components/Statistics';
import { useDashboardData } from '@/hooks/useDashboardData';

const AnalyticsPage = () => {
  const { counts, loading, error } = useDashboardData();

  return (
    <>
      <PageTitle title="Dashboards" />
      {/* Stat cards: Properties, Landlords, Tenants, Conversion Rate */}
      <Statistics counts={counts} loading={loading} />
      {/* Lead Origin radial + Map + Weekly Sales carousel */}
      <SocialSource counts={counts} loading={loading} />
    </>
  );
};

export default AnalyticsPage;