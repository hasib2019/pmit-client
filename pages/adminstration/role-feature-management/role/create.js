import React, { Fragment } from 'react';
import CreateRole from 'components/mainSections/adminstration/role-feature-management/role/CreateRole';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Create = () => {
  const title = 'রোল তৈরি';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <CreateRole />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Create;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
