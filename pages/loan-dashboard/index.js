import InnerLanding from 'components/shared/layout/InnerLanding';
//import requireAuthentication from "components/mainSections/RouteGuard/HOC";
import LoanDashboard from 'components/mainSections/loan-dashboard/LoanDashboard';
const Index = () => {
  return (
    <InnerLanding>
      <LoanDashboard />
    </InnerLanding>
  );
};

export default Index;

// export const getServerSideProps = requireAuthentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     }
//   };
// })
