import PendingList from 'components/coop/setup/role/PendingList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import Authentication from 'middleware/Authentication';
const approve = () => {
  const title = 'রোল অনুমোদন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <PendingList />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default approve;
export const getServerSideProps = Authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
