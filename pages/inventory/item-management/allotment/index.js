import { allotmentPageTitle } from 'components/inventory/constants';
import Allotment from 'components/inventory/mainSections/allotment/allotment';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {

  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={allotmentPageTitle}>
          <Allotment />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default Index;
