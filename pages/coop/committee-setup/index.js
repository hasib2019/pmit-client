import ApplyForCommittee from 'components/coop/committee-setup/CommSetup';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'কমিটি গঠনের জন্য আবেদন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <ApplyForCommittee />
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
