import FeatureCreate from 'components/coop/setup/feature/FeatureCreate';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const index = () => {
  const title = 'ফিচার ব্যবস্থাপনা';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <FeatureCreate />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;
