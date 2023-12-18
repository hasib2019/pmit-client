import React, { Fragment } from 'react';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { ReportG } from 'components/accounts/mainSections/report-generation/ReportG';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'বেসিক রিপোর্ট';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <ReportG reportBunchName={'accounts_basic_report'} />
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
