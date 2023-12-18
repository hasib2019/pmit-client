import { ReportG } from 'components/mainSections/report-generation/ReportG';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'ক্রয় আদেশের রিপোর্ট';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <ReportG reportBunchName={'inventory_purchase_report'} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
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
