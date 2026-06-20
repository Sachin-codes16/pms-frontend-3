import FallbackLoading from '@/components/FallbackLoading';
import Preloader from '@/components/Preloader';
import { lazy, Suspense } from 'react';
import { Container } from 'react-bootstrap';
const TopNavigationBar = lazy(() => import('@/components/layout/TopNavigationBar/page'));
const VerticalNavigationBar = lazy(() => import('@/components/layout/VerticalNavigationBar/page'));
const AdminLayout = ({
  children
}) => {
  return <div className="wrapper">
      <Suspense fallback={<FallbackLoading />}>
        <TopNavigationBar />
      </Suspense>
      <Suspense fallback={<FallbackLoading />}>
        <VerticalNavigationBar />
      </Suspense>
      <div className="page-content">
        <Container fluid>
          <Suspense fallback={<Preloader />}>{children}</Suspense>
        </Container>
      </div>
    </div>;
};
export default AdminLayout;
