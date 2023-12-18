import React from 'react';
import ProjectSetup from 'components/mainSections/adminstration/project-setup/create-project/ProjectSetup';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'প্রকল্প/তহবিল তৈরি';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ProjectSetup />
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
