import React, { Fragment } from 'react';

import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import DayOpneClose from 'components/accounts/mainSections/adminstration/dayOpenClose-setup/day-close/DayOpenClose';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'ডে ওপেন/ক্লোজ';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <DayOpneClose />
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
