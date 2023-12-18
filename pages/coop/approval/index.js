import Approvals from 'components/coop/approval/ApprovalData';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'কার্যক্রমের তালিকা';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <Approvals />
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
