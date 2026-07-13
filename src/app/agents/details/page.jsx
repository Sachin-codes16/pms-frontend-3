import PageTitle from '@/components/PageTitle';
import AgentDetails from './components/AgentDetails';
import AgentsDetailsBanner from './components/AgentsDetailsBannner';
const AgentsDetailsPage = () => {
  return <>
      <PageTitle subName="Real Estate" title="Agent Overview" />
      <AgentsDetailsBanner />
      <AgentDetails />
    </>;
};
export default AgentsDetailsPage;
