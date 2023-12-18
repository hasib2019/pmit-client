import EmployeeSalary from 'components/coop/samity-accounts-management/salary/EmployeeSalary';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'বেতন প্রদান';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <EmployeeSalary />
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
