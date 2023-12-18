import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import VehicleInclusion from 'components/vms/vehicle-inclusion/VehicleInclusion';

export default function Vehicleinclusion(props) {
  const title = 'যানবাহনের তালিকা';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <VehicleInclusion />
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
