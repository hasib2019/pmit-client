import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import { ReportG } from 'components/mainSections/report-generation/ReportG';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'সমিতি ও সদস্যের তথ্য সংক্রান্ত রিপোর্ট';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ReportG reportBunchName={'samity_report'} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
