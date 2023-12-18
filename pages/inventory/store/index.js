import { storePageTitle } from 'components/inventory/constants';
import StoreComponent from 'components/inventory/mainSections/store/store';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={storePageTitle}>
          <StoreComponent />
        </PaperFormsLayout>
      </InnerLanding>
    </>
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
