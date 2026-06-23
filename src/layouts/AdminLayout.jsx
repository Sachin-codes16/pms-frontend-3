import FallbackLoading from '@/components/FallbackLoading';
import Preloader from '@/components/Preloader';
import { lazy, Suspense } from 'react';
import { Container } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const TopNavigationBar = lazy(() => import('@/components/layout/TopNavigationBar/page'));
const VerticalNavigationBar = lazy(() => import('@/components/layout/VerticalNavigationBar/page'));

const AdminLayout = ({
  children
}) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/auth/sign-in?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

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
