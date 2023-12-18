
import BasicTabs from 'components/accounts/mainSections/account/transection/VoucherPosting2';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  const title = 'ভাউচার পোস্টিং';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <BasicTabs />
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
