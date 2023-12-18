import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import MemberCorrecton from 'components/mainSections/samity-managment/member-correction/MemberCorrecton';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = (props) => {
  const title = ' সদস্য সংযোজন / সংশোধন';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <MemberCorrecton {...{ props: props.query }} />
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
