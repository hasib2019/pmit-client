
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @author Md Ziaul Rahman
 * @email ziaurrahaman939@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */

import ManualSamity from 'components/coop/samity-management/manual-samity/ManualSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { Helmet } from 'react-helmet';
const index = () => {
  const title = 'নিবন্ধিত সমিতি সমূহ অনলাইনে তালিকাভুক্তকরণ';
  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <ManualSamity />
        </PaperFormsLayout>
      </InnerLanding>
    </>
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
