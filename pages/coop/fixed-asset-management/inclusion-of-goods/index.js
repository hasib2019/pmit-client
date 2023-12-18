import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import InclusionOfGoods from 'components/coop/fixed-asset-management/inclusionOfGoods';
const index = () => {
  const title = 'মালামাল অন্তর্ভুক্তিকরন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <InclusionOfGoods />
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
