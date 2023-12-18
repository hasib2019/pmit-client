import MemberRegistration from 'components/mainSections/samity-managment/member-registration/MemberFromCoop';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = (props) => {
  const title = 'সদস্যের তালিকা';
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <MemberRegistration />
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
