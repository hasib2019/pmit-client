import FdrApplication from 'components/mainSections/fdr-management/fdr-application/FdrApplication';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = 'এফডিআর হিসাব খোলা';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <FdrApplication />
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
