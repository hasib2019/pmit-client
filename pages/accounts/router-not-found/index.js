import { Fragment } from 'react';
import InnerLanding from 'components/shared/layout/InnerLanding';

const Index = (props) => {
  return (
    <Fragment>
      <InnerLanding query={props.query}>
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
