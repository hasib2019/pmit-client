import { ReportG } from 'components/mainSections/report-generation/ReportG';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'ভাউচার রিপোর্ট';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <ReportG reportBunchName={'transaction_report'} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
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
