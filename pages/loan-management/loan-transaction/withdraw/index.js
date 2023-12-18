import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import Withdraw from 'components/mainSections/loan-management/loan-transaction/withdraw/Withdraw';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  const title = 'নগদ উত্তোলন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <Withdraw />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default Index;

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
