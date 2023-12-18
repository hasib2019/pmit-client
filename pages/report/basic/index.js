import { Paper } from '@mui/material';
import InnerLanding from 'components/shared/layout/InnerLanding';
import { Fragment } from 'react';

const Index = (props) => {
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        <Paper>{/* <Dashboard/> */}</Paper>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;

export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
