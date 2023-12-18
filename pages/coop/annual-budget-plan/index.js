import AnnualBudgetPlan from 'components/coop/annual-budget-plan/annualBudgetPlan';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const index = () => {
  const title = 'বাৎসরিক বাজেট পরিকল্পনা';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <AnnualBudgetPlan />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;

// export const getServerSideProps = authentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
