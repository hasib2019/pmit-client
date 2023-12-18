import React from 'react';
import Approve from 'components/accounts/mainSections/approval/Approval';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const approvaldata = (props) => {
  const title = 'আবেদনের তথ্যাদি';
  const { query } = props;
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Approve approvalData={query} />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}

export default approvaldata;
