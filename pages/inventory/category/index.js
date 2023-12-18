import { itemCategoryPageTitle } from 'components/inventory/constants.js';
import ItemCategory from 'components/inventory/mainSections/category/item-category';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={itemCategoryPageTitle}>
          <ItemCategory />
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
