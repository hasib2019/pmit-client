import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import Adjustment from 'components/mainSections/loan-management/loan-transaction/loan-adjustment/Adjustment';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = 'সঞ্চয়ের মাধ্যমে ঋণের সমন্বয়';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <Adjustment />
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
