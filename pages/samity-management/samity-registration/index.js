import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import Registration from 'components/mainSections/samity-managment/samity-registration/Registration';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = () => {
  const title = 'সমিতির অন্তুর্ভুক্তি';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Registration />
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

// export async function getServerSideProps(context) {

// return {
//     props: {
//       query: context.query,
//     },
//   };
// }
