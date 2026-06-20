import PageTitle from '@/components/PageTitle';
import { Card, Row } from 'react-bootstrap';
import EmailView from './components/EmailView';
const InboxPage = () => {
  return <>
      <PageTitle title="Inbox" subName="Real Estate" />
      <Card>
        <Row className="g-0">
          <EmailView />
        </Row>
      </Card>
    </>;
};
export default InboxPage;