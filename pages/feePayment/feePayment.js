import Feepayment from 'components/Feepayment/Feepayment';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
// import requireAuthentication from "components/mainSections/RouteGuard/HOC";
const FeePayment = () => {
  const title = 'ফি প্রদানের আবেদন';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Feepayment />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default FeePayment;
// export const getServerSideProps = requireAuthentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
