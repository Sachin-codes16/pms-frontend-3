import IconifyIcon from '@/components/wrappers/IconifyIcon';
import LeftSideBarToggle from './components/LeftSideBarToggle';
// import ProfileDropdown from './components/ProfileDropdown';
import ProfileSettingPage from './components/ProfileSettingPage';
import Notifications from './components/Notifications';
import { Container } from 'react-bootstrap';


// ✅ IMAGE
import alwijhaLogo from '@/assets/images/app-calendar/alwijha.webp';

const page = () => {
  return (
    <header >
      <div  className="topbar" >
        <Container fluid>
          <div className="navbar-header">

            {/* LEFT SIDE */}
            <div className="d-flex align-items-center gap-2">
              <LeftSideBarToggle />

              <div className="d-flex align-items-center gap-2 ms-2">
                <img
                  src={alwijhaLogo}
                  alt="Alwijha Real Estate"
                  height="60"
                />

                {/* 🔵 EXACT TEXT STYLE */}
                <span
                  style={{
                    color: '#1f2b6c',      // navy blue
                    fontSize: '20px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase'
                  }}
                >
                  CHECK-IN / CHECK-OUT DEPARTMENT
                </span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="d-flex align-items-center gap-1">
              <Notifications />
    
              <ProfileSettingPage />
            </div>

          </div>
        </Container>
      </div>
    </header>
  );
};

export default page;
