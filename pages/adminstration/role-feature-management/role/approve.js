import React, { Fragment } from 'react';
import PendingList from 'components/mainSections/adminstration/role-feature-management/role/PendingList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const approve = () => {
  const title = 'রোল অনুমোদন';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <PendingList />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default approve;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
