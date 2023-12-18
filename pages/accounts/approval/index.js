import Approvals from 'components/accounts/mainSections/approval/ApprovalData';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const index = () => {
  const title = 'অনুমোদনের তালিকা';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Approvals />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;
