import { Process } from 'components/mainSections/process/Process.jsx';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperReportsFromLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'অপারেশন ডাটা প্রসেস';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <Process processName={'operation_process'} />
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
