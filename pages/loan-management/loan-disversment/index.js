import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import LoanDisversment from 'components/mainSections/loan-management/loan-disversment/LoanDisversment';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';
const Index = () => {
  const title = 'ঋণ বিতরণ';
  return (
    <Fragment>
      <InnerLanding>
        {/* <TopNav /> */}
        <PaperFormsLayout getValue={title}>
          <LoanDisversment />
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
