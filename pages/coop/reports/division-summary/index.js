/**
 * @author Md Saifur Rahman
 * @email saifur1985bd@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */

import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperReportsFromLayout';
import ReportTemplateDivision from 'components/utils/coop/ReportTemplateDivision';
import authentication from 'middleware/Authentication';
import { tokenData } from 'service/common';

const index = () => {
  const title = 'বিভাগভিত্তিক সারসংক্ষেপ';
  const userData = tokenData();

  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        {userData?.type == 'user' ? <ReportTemplateDivision {...{ userData }} /> : ''}
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
