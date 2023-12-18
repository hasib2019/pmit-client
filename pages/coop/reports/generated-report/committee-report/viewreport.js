/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022-07-21 9.50.00
 * @modify date 2022-07-21 9.50.00
 * @desc [description]
 */
import { decode } from 'js-base64';
import ApproveSamityReport from 'components/shared/common/ApproveSamityReport';
import PaperReportsFromLayout from 'components/shared/layout/PaperReportsFromLayout';
import authentication from 'middleware/Authentication';
const viewreport = (props) => {
  const { query } = props;

  let reportsId = decode(query.samityId);

  return (
    <PaperReportsFromLayout>
      <ApproveSamityReport {...{ reportsId }} />
    </PaperReportsFromLayout>
  );
};

export default viewreport;
export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
