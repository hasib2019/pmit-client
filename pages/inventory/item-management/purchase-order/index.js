import PurchaseOrder from 'components/inventory/mainSections/purchaseOrder/purchaseOrder';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = () => {
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={`ক্রয় আদেশ`}>
        <PurchaseOrder />
      </PaperFormsLayout>
    </InnerLanding>
  );
};
export default Index;
