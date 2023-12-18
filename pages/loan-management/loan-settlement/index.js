import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import LoanSettlement from 'components/mainSections/loan-management/loan-settlement/LoanSettlement';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = 'ঋণের বকেয়া অগ্রিম পরিশোধ/ ক্লোজ';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <LoanSettlement />
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
