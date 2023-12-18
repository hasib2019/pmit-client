import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import FoSetup from 'components/mainSections/adminstration/fo-setup/FoSetup';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'মাঠ কর্মী নির্বাচন';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <FoSetup />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});

// const Index = (props) => {
//   const title = "মাঠ কর্মী বরাদ্দ";
//   return (
//     <Fragment>
//       <InnerLanding query={props.query}>
//         <PaperFormsLayout getValue={title}>
//           <FoSetup />
//         </PaperFormsLayout>
//       </InnerLanding>
//     </Fragment>
//   );
// };

// export default Index;

// export async function getServerSideProps(context) {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// }
