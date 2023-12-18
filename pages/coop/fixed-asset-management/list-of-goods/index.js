import ListOfGoods from 'components/coop/fixed-asset-management/listofGoods';
import SelectSamity from 'components/shared/common/SelectSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { useState } from 'react';

const Index = () => {
  const title = 'মালামালের তালিকা';

  const [samityId, setSamityId] = useState();
  const [samityLevel, setSamityLevel] = useState();
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <SelectSamity {...{ samityId, setSamityId, samityLevel, setSamityLevel }} />
        {samityId ? <ListOfGoods samityId={samityId} /> : ''}
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default Index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
