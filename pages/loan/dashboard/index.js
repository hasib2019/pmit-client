import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import Dashboard from 'components/mainSections/dashboard/Dashboard';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const index = () => {
  const title = 'ব্যবহারকারীর কার্যক্রমের তালিকা';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Dashboard />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
