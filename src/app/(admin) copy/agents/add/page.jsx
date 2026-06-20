import FileUpload from '@/components/FileUpload';
import PageTitle from '@/components/PageTitle';
import { Col, Row } from 'react-bootstrap';
import AgentAdd from './components/AgentAdd';
import AgentAddCard from './components/AgentAddCard';
const AgentAddPage = () => {
  return <>
      <PageTitle subName="" title="" />
      <Row>
        <AgentAddCard />
        <Col xl={9} lg={8}>
          <FileUpload title="Add Agent Photo" />
          <AgentAdd />
        </Col>
      </Row>
    </>;
};
export default AgentAddPage;