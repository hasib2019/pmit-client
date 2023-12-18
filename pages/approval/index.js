import React from 'react';
import Approvals from 'components/mainSections/approval/ApprovalData';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const index = () => {
  const title = 'সেবাসমূহের অনুমোদন';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Approvals />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
