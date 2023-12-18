import SamityReport from 'components/mainSections/report-generation/SamityReport';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = (props) => {
  const title = 'সমিতির তথ্য সংক্রান্ত রিপোর্ট ';
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <SamityReport />
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
