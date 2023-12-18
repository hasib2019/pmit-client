import EditMemberRegistration from 'components/mainSections/samity-managment/edit-member-registration/EditMemberRegistrationFromNormal';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = () => {
  const title = 'সদস্য নিবন্ধন-হালনাগাদ';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <EditMemberRegistration />
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
