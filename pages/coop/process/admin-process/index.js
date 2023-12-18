import { Process } from 'components/mainSections/process/Process.jsx';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'অ্যাডমিন ডাটা প্রসেস';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <Process processName={'admin_process'} />
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
