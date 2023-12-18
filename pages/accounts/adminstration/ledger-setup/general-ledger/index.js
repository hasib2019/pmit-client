import GeneralLedger from 'components/accounts/mainSections/adminstration/ledger-setup/general-ledger/GeneralLedger';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = () => {
  const title = 'জেনারেল লেজার';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <GeneralLedger />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
