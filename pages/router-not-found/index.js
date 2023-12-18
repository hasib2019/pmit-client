import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import { Fragment } from 'react';

const Index = () => {
  return (
    <Fragment>
      <InnerLanding>
        <div>
          <h1>404!Page not found</h1>
        </div>
        {/* <Grid container>
                    <Dashboard/>
                    </Grid> */}
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
