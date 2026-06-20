import logoDark from '@/assets/images/app-calendar/alwijha-white.png';
import logoLight from '@/assets/images/app-calendar/alwijha-white.png';
import logoSm from '@/assets/images/app-calendar/alwijha-white.png';
import { Link } from 'react-router-dom';
const LogoBox = () => {
  return <div className="logo-box">
      <Link to="/dashboards" className="logo-dark">
        <img width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
        <img width={150} height={38} src={logoDark} className="logo-lg" alt="logo dark" />
      </Link>
      <Link to="/dashboards" className="logo-light">
        <img width={28} height={28} src={logoSm} className="logo-sm" alt="logo sm" />
        <img width={150} height={38} src={logoLight} className="logo-lg" alt="logo light" />
      </Link>
    </div>;
};
export default LogoBox;
