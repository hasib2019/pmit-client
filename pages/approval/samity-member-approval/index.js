import React, { Fragment } from 'react';
import SamityMemberApproval from 'components/mainSections/approval/samity-member-approval/Index';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = () => {
  const title = 'সমিতি ও সদস্য অনুমোদন';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SamityMemberApproval />
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
