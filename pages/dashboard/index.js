/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-27 12:03:38
 * @desc [description]
 */
import HomeComponent from 'components/accounts/mainSections/home/HomeComponent';
import AdminDashboard from 'components/coop/admin-dashboard/Dashboard';
import CitizenDashboard from 'components/coop/citizen-dashboard/Dashboard';
import LandingDashboard from 'components/landing-dashboard/LandingDashboard';
import LoanDashboard from 'components/mainSections/dashboard/Dashboard';
import InnerLanding from 'components/shared/layout/InnerLanding';
import authentication from 'middleware/Authentication';
import { tokenData } from 'service/common';

const index = () => {
  const userData = tokenData();
  return (
    <InnerLanding>
      {userData?.componentId == 1 ? (
        <LoanDashboard />
      ) : userData?.componentId == 2 ? (
        userData?.type == 'user' ? (
          <AdminDashboard />
        ) : (
          <CitizenDashboard />
        )
      ) : userData?.componentId == 7 ? (
        <HomeComponent />
      ) : userData?.componentId == 9 ? (
        <LoanDashboard />
      ) : (
        <LandingDashboard />
      )}
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
