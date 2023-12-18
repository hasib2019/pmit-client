import DpsApplication from 'components/mainSections/dps-mamagement/dps-application/DpsApplication';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = 'ডিপিএস এর আবেদন';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <DpsApplication />
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
