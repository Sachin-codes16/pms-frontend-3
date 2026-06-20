import LogoBox from '@/components/LogoBox';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { getMenuItems } from '@/helpers/Manu';
import AppMenu from './components/AppMenu';
import HoverMenuToggle from './components/HoverMenuToggle';
const page = () => {
  const menuItems = getMenuItems();
  return <div className="main-nav" id='leftside-menu-container'>
      <LogoBox />
      <HoverMenuToggle />
      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>;
};
export default page;