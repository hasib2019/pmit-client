
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-27 12:03:38
 * @desc [description]
 */
import CoopDashboard from 'components/coop/coop-dashboard/CoopDashboard';
import InnerLanding from 'components/shared/layout/InnerLanding';

const index = () => {
  return (
    <InnerLanding>
      <CoopDashboard />
    </InnerLanding>
  );
};

export default index;

// export const getServerSideProps = authentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
