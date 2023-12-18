import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import SavingsProduct from 'components/mainSections/adminstration/product-setup/savings-product/SavingsProduct';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const index = () => {
  const title = 'সঞ্চয়ী প্রোডাক্ট';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SavingsProduct />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default index;

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
