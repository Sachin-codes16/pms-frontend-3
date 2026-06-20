import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import { appRoutes, authRoutes } from '@/routes/index';
import { Route, Routes } from 'react-router-dom';

const AppRouter = props => {
  return <Routes>
      {(authRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={<AuthLayout {...props}>{route.element}</AuthLayout>} />)}

      {(appRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={<AdminLayout {...props}>{route.element}</AdminLayout>} />)}
    </Routes>;
};

export default AppRouter;