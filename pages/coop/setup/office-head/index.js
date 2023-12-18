import OfficeHead from 'components/coop/setup/office-head/OfficeHead';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const index = () => {
  const title = 'অফিস প্রধান বরাদ্দ';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <OfficeHead />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;
