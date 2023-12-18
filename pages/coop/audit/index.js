/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
import AuditDisUpa from 'components/coop/audit/AuditDisUpa';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperReportsFromLayout';
import authentication from 'middleware/Authentication';
import { localStorageData, tokenData } from 'service/common';

const index = () => {
  const title = 'নিরীক্ষক বরাদ্দকরণ';
  const token = localStorageData('token');
  const GettokenData = tokenData(token);

  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>{GettokenData?.type == 'user' ? <AuditDisUpa /> : ''}</PaperFormsLayout>
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
