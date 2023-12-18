import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import ProductList from 'components/mainSections/adminstration/product-setup/savings-product-update/ProductList';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const index = () => {
  const title = 'সঞ্চয়ী প্রোডাক্ট আপডেট';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ProductList />
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
