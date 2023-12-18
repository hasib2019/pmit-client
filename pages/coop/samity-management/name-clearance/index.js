import NameClearance from 'components/coop/samity-management/name-clearance/NameClear';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { tokenData } from 'service/common';

const index = (props) => {
  const userData = tokenData();
  const title = userData?.doptorId == 2 ? 'সমিতি/দল নাম যাচাই' : 'নেম ক্লিয়ারেন্স / নামের ছাড়পত্র';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <NameClearance propsData={props} />
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
