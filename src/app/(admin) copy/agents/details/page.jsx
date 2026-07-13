import PageTitle from '@/components/PageTitle';
import AgentDetails from './components/AgentDetails';
import AgentsDetailsBanner from './components/AgentsDetailsBannner';
const AgentsDetailsPage = () => {
  return <>
  <div style={{
        fontSize: '1.2rem',
        fontWeight: 500,
        color: 'black',
        marginBottom: '1rem',
        paddingLeft: ''
      }}>
        Landlord Overview/Landlord
      </div>
      
      <AgentsDetailsBanner />
      <AgentDetails />
    </>;
};
export default AgentsDetailsPage;