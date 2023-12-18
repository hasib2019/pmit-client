import React, { Fragment } from 'react';
import DayClose from 'components/mainSections/adminstration/dayOpenClose-setup/day-close/DayClose';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = () => {
  const title = 'ডে ওপেন/ক্লোজ';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <DayClose />
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
