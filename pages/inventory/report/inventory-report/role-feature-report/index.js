import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { ReportG } from 'components/mainSections/report-generation/ReportG';
const Index = () => {
  const title = 'রোল ফিচারের রিপোর্ট';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ReportG reportBunchName={'inventory_basic_report'} />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default Index;
