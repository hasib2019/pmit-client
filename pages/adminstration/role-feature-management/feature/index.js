import React, { Fragment } from 'react';
import FeatureCreate from 'components/coop/setup/feature/FeatureCreate';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';

const Index = () => {
  const title = 'ফিচার তৈরি';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <FeatureCreate />
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
