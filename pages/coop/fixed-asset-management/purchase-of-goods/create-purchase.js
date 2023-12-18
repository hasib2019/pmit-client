import CreatePurchase from 'components/coop/fixed-asset-management/createpurchase';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { useRouter } from 'next/router';
const Index = () => {
  const title = 'মালামাল ক্রয়/ সংযোজন';
  const router = useRouter();

  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <CreatePurchase
          {...{
            purchaseDetails: router.query.purchase_details,
            samityId: router.query.samityId,
            productid: router.query.productId,
          }}
        />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default Index;

// export const getServerSideProps = authentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
