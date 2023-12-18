import InnerLanding from 'components/shared/layout/InnerLanding';
import { Fragment } from 'react';

const Index = (props) => {
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        {/* <Grid container>
                    <Dashboard/>
                    </Grid> */}
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
