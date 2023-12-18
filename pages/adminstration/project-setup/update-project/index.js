import React from 'react';
import EditProject from 'components/mainSections/adminstration/project-setup/update-project/EditProject';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import InnerLanding from 'components/shared/layout/InnerLanding';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'প্রকল্প আপডেট';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <EditProject />
        </PaperFormsLayout>
      </InnerLanding>
    </>
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
