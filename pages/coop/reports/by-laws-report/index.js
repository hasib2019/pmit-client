/* eslint-disable react-hooks/rules-of-hooks */
import ByLawsReport from 'components/coop/reports/by-laws-report/ByLawsReport';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const index = (props) => {
  const title = 'উপআইন সংশোধনের রিপোর্ট';

  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ByLawsReport {...{ samityId: props.query.samityId }} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default index;

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
