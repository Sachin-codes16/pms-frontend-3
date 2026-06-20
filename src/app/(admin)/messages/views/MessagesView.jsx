import PageTitle from '@/components/PageTitle';
import { ChatProvider } from '@/context/useChatContext';
import { Row } from 'react-bootstrap';
import { useMessagesController } from '../controllers/useMessagesController';
import ChatApp from '../components/ChatApp';

const MessagesView = () => {
  useMessagesController();

  return (
    <>
      <PageTitle title="Messages" subName="Real Estate" />
      <Row className="g-1">
        <ChatProvider>
          <ChatApp />
        </ChatProvider>
      </Row>
    </>
  );
};

export default MessagesView;
