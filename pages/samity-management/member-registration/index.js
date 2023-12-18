import MemberRegistration from 'components/mainSections/samity-managment/member-registration/MemberRegistration';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
//import SamityAndMemberRegistration from "components/mainSections/samity-managment/member-registration/SamityAndMemberRegistration"
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = (props) => {
  const title = 'সদস্য  নিবন্ধন';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <MemberRegistration queryData={props.query} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Index;
