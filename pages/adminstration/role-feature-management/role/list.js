import React, { Fragment } from 'react';
import RoleList from 'components/mainSections/adminstration/role-feature-management/role/RoleList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const List = () => {
  const title = 'রোলের তালিকা';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <RoleList />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default List;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
