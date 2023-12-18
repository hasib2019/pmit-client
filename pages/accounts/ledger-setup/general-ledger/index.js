import React, { Fragment } from 'react';
import GeneralLedger from 'components/accounts/mainSections/account/ledger-setup/general-ledger/GeneralLedger';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'জেনারেল লেজারের তালিকা';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <GeneralLedger />
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
