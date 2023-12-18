import MemberList from 'components/mainSections/samity-managment/member-list/MemberList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'সদস্য তালিকা-হালনাগাদ';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <MemberList />
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
