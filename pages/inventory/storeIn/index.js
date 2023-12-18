import ItmeStoreMigration from 'components/inventory/mainSections/itemStoreInMigration/itemStoreMigration';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { stortInMigrationPageTitle } from 'components/inventory/constants';
const Index = () => {
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={stortInMigrationPageTitle}>
        <ItmeStoreMigration />
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
