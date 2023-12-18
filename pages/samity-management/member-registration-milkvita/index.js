import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import MemberRegistration from 'components/mainSections/samity-managment/member-registration/MemberFromMilkvita';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
//import SamityAndMemberRegistration from "components/mainSections/samity-managment/member-registration/SamityAndMemberRegistration"

const Index = (props) => {
  const title = 'সদস্য নিবন্ধন(মিল্কভিটা থেকে আগত)';
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        <PaperFormsLayout getValue={title}>
          <MemberRegistration queryData={props.query} />
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
