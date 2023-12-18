import React, { Fragment } from 'react';
import TransectionSanctionLimit from 'components/mainSections/adminstration/transection-sanction-limit/TransectionSanctionLimit';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = ' ঋণ অনুমোদনের সীমা ';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <TransectionSanctionLimit />
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
