import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { supplierPageTitle } from 'components/inventory/constants';
import Supplier from 'components/inventory/mainSections/supplier/supplier';
const Index = () => {
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={supplierPageTitle}>
        <Supplier />
      </PaperFormsLayout>
    </InnerLanding>
  );
};
export default Index;
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// }
