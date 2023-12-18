import { itemGroupPageTitle } from 'components/inventory/constants.js';
import Group from 'components/inventory/mainSections/group/item-group';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={itemGroupPageTitle}>
          <Group />
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
