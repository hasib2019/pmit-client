/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
import CitizenReport from 'components/coop/reports/basic-report/documents/CitizenReport';
import UserReport from 'components/coop/reports/basic-report/documents/UserReport';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperReportsFromLayout';
import authentication from 'middleware/Authentication';
import { tokenData } from 'service/common';

const index = () => {
  const title = 'সমিতির ডকুমেন্টস';
  const GettokenData = tokenData();

  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        {GettokenData?.type == 'citizen' ? <CitizenReport /> : ''}
        {GettokenData?.type == 'user' ? <UserReport /> : ''}
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
