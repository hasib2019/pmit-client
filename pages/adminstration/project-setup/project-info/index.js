import React from 'react';
import ProjectInfo from 'components/mainSections/adminstration/project-setup/project-info/ProjectInfo';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'প্রকল্পের তালিকা';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ProjectInfo />
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
