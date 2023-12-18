import CreatePurpose from 'components/administration/create-purpose/CreatePurpose';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
export default function Createpurpose(props) {
  const title = 'ঋণের শ্রেণী তৈরি';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <CreatePurpose />
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
