import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import Attendance from 'components/mainSections/samity-managment/attendance/Attendance';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'সভার কার্যবিবরণী';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <Attendance />
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
