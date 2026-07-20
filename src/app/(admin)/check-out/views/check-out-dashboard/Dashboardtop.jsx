import CheckOutDashboardHeader from './CheckOutDashboardHeader';
import CheckOutStats from './CheckOutStats';

const Dashboardtop = ({ stats = [] }) => (
  <>
    <CheckOutDashboardHeader />
    <div className="mt-4">
      <CheckOutStats stats={stats} />
    </div>
  </>
);

export default Dashboardtop;
