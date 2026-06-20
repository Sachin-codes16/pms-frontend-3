import PageTitle from '@/components/PageTitle';
import { usePropertyListController } from '../../controllers/usePropertyListController';
import PropertyList from '../../list/components/PropertyList';
import PropertyStat from '../../list/components/PropertyStat';

const PropertyListView = () => {
  usePropertyListController();

  return (
    <>
      <PageTitle title="" subName="" />
      <PropertyStat />
      <PropertyList />
    </>
  );
};

export default PropertyListView;
