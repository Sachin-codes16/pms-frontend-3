import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';

const LogoutButton = () => {
  const { removeSession } = useAuthContext();

  return (
    <button
      onClick={removeSession}
      title="Logout"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        color: '#6b7280',
      }}
    >
      <IconifyIcon icon="ri:logout-box-r-line" width={20} height={20} />
    </button>
  );
};

export default LogoutButton;
