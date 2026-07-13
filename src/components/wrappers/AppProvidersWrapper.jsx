import { DEFAULT_PAGE_TITLE } from '@/context/constants';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { LayoutProvider } from '@/context/useLayoutContext';
import { NotificationProvider } from '@/context/useNotificationContext';
import { AuthProvider } from '@/context/useAuthContext';
const AppProvidersWrapper = ({
  children
}) => {
  const handleChangeTitle = () => {
    if (document.visibilityState == 'hidden') document.title = 'Please come back 🥺';else document.title = DEFAULT_PAGE_TITLE;
  };
  useEffect(() => {
    if (document) {
      const e = document.querySelector('#__next_splash');
      if (e?.hasChildNodes()) {
        document.querySelector('#splash-screen')?.classList.add('remove');
      }
      e?.addEventListener('DOMNodeInserted', () => {
        document.querySelector('#splash-screen')?.classList.add('remove');
      });
    }
    document.addEventListener('visibilitychange', handleChangeTitle);
    return () => {
      document.removeEventListener('visibilitychange', handleChangeTitle);
    };
  }, []);
  return <AuthProvider>
      <LayoutProvider>
        <NotificationProvider>
          {children}
          <ToastContainer theme="colored" />
        </NotificationProvider>
      </LayoutProvider>
    </AuthProvider>;
};
export default AppProvidersWrapper;