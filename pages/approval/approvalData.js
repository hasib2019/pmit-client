import Approve from 'components/mainSections/approval/Approval';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const approvaldata = (props) => {
  const { query } = props;
  console.log('query12', query);
  const serviceName = JSON.parse(decodeURIComponent(query?.data))?.serviceName;
  console.log('queryValue', serviceName);
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout>
          <Approve approvalData={query} />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
// export const getServerSideProps = requireAuthentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     }
//   };
// })
export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
export default approvaldata;
