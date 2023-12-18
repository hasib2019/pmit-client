import DpsClose from 'components/mainSections/dps-mamagement/dps-close/DpsClose';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = 'ডিপিএস ক্লোজ';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <DpsClose />
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
