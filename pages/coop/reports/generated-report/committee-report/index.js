import { ReportG } from 'components/coop/reports/ReportG';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'কমিটি রিপোর্ট';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <ReportG reportBunchName={'committee_report'} />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
