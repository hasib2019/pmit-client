import CreateRole from 'components/coop/setup/role/CreateRole';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import Authentication from 'middleware/Authentication';
const Create = () => {
  const title = 'রোল তৈরি';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <CreateRole />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default Create;
export const getServerSideProps = Authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
