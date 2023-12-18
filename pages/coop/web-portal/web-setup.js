import WebSetup from 'components/coop/web-portal/Web-Setup';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const websetup = () => {
  const title = 'ওয়েব সাইট সেটআপ';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <WebSetup />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default websetup;
export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
