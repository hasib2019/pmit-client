import CreateProject from 'components/administration/create-project/CreateProject';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
export default function Createproject(props) {
  const title = 'ঋণের শ্রেণী তৈরি';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <CreateProject />
      </PaperFormsLayout>
    </InnerLanding>
  );
}

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
