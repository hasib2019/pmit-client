import React, { Fragment } from 'react';
import EditFo from 'components/mainSections/adminstration/fo-setup/EditFo';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const Index = () => {
  const title = 'মাঠকর্মী বরাদ্দ';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <EditFo />
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
