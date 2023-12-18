import ItemRequisition from 'components/inventory/mainSections/itemRequisition/itemRequisition';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {

  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={'মালামালের আবেদন / চাহিদাপত্র'}>
          <ItemRequisition />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default Index;
