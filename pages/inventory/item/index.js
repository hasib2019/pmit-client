import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { itemPageTitle } from 'components/inventory/constants.js';
import Item from 'components/inventory/mainSections/item/item';
import InnerLanding from 'components/shared/layout/InnerLanding';
const Index = () => {
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={itemPageTitle}>
          <Item />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
