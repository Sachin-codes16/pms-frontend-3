import { useFacilitiesController } from '../controllers/useFacilitiesController';

const FacilitiesView = () => {
  const { title } = useFacilitiesController();

  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default FacilitiesView;
