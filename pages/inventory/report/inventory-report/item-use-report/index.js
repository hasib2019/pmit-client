import { ReportG } from 'components/mainSections/report-generation/ReportG';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  const title = 'ব্যবহৃত মালামালের রিপোর্ট';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ReportG reportBunchName={'inventory_item_use_report'} />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default Index;

// export const getServerSideProps = requireAuthentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
