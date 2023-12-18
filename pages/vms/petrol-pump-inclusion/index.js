import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import PetrolPumpInclusion from 'components/vms/petrol-pump-inclusion/PetrolPumpInclusion';

export default function PpumpInclusion() {
  const title = 'পেট্রোল পাম্পের তালিকা';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <PetrolPumpInclusion />
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
