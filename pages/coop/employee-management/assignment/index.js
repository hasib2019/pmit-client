import EmployeeRankAssignment from 'components/coop/employee-management/EmployeeRankAssignment';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'পদবী বরাদ্দকরন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <EmployeeRankAssignment />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
