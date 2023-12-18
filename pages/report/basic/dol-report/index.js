// import DolReport from 'components/mainSections/report-generation/DolReport';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = (props) => {
  const title = 'দলের তথ্য সংক্রান্ত রিপোর্ট ';
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          {/* <DolReport /> */}
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
