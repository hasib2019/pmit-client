import Approve from 'components/coop/approval/Approval';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const approvaldata = (props) => {
  const { query } = props;

  return (
    <InnerLanding>
      <PaperFormsLayout getValue={JSON.parse(decodeURIComponent(query.data)).serviceName}>
        <Approve approvalData={query} />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default approvaldata;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
