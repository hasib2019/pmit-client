import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import Creategoods from 'components/coop/fixed-asset-management/creategoods';

const index = (props) => {
  const title = 'মালামাল অন্তর্ভুক্তিকরন';

  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <Creategoods {...{ productDetails: props.query.goods_data }} />
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
