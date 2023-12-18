import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import Listofdrivers from 'components/vms/driver-list/Listofdrivers';

export default function ListofDrivers() {
  const title = 'ড্রাইভার তালিকা';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <Listofdrivers />
      </PaperFormsLayout>
    </InnerLanding>
  );
}

// export const getServerSideProps = requireAuthentication((context) => {
//     return {
//         props: {
//             query: context.query,
//         }
//     };
// })
