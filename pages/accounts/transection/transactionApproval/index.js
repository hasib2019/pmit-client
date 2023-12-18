import React, { Fragment } from 'react';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import TransactionApproval from 'components/accounts/mainSections/account/transection/transactionApproval';

const Index = () => {
  const title = 'অনুমোদন';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <TransactionApproval />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
