import { measurementPageTitle } from 'components/inventory/constants';
import MesaurementUnit from 'components/inventory/mainSections/measurement-unit/measurementUnit';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={measurementPageTitle}>
          <MesaurementUnit />
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
