import RoleList from 'components/coop/setup/role/RoleList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import Authentication from 'middleware/Authentication';
const List = () => {
  const title = 'রোলের তালিকা';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <RoleList />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default List;
export const getServerSideProps = Authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
