import { Process } from 'components/mainSections/process/Process';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = (props) => {
  const title = 'অ্যাডমিন ডাটা প্রসেস';
  return (
    <InnerLanding query={props.query}>
      {/* <TopNav /> */}
      <PaperFormsLayout getValue={title}>
        <Process processName={'admin_process'} />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
