import GroupEdit from 'components/mainSections/samity-managment/group-edit/GroupEdit';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'দল হালনাগাদ';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <GroupEdit />
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
