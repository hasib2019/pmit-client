import { Process } from 'components/mainSections/process/Process';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = (props) => {
  const title = 'অপারেশন ডাটা প্রসেস';
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <Process processName={'operation_process'} />
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
