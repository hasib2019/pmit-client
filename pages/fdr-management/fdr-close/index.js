import FdrClose from 'components/mainSections/fdr-management/fdr-account-close/FdrClose';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = ' এফ. ডি. আর হিসাব ক্লোজ';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <FdrClose />
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
