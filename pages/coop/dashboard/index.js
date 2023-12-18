
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-27 12:03:38
 * @desc [description]
 */
import AdminDashboard from 'components/coop/admin-dashboard/Dashboard';
import CitizenDashboard from 'components/coop/citizen-dashboard/Dashboard';
import InnerLanding from 'components/shared/layout/InnerLanding';
import authentication from 'middleware/Authentication';
import { localStorageData, tokenData } from 'service/common';

const index = () => {
  const token = localStorageData('token');
  const userData = tokenData(token);
  return (
    <InnerLanding>
      {userData && userData?.type == 'citizen' ? <CitizenDashboard /> : ''}
      {userData && userData?.type == 'user' ? <AdminDashboard /> : ''}
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
