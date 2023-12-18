import React, { Fragment } from 'react';
import DocumentMapping from 'components/mainSections/adminstration/document-setup/Document-mapping';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = () => {
  const title = 'ডকুমেন্ট ম্যাপিং';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <DocumentMapping />
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
