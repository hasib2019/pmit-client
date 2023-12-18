import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperReportsFromLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'ডকুমেন্ট ডাউনলোড';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}></PaperFormsLayout>
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
