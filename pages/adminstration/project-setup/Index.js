import { Paper } from '@mui/material';
import React from 'react';
import InnerLanding from 'components/shared/layout/InnerLanding';

const Index = (props) => {
  return (
    <>
      <InnerLanding query={props.query}>
        <Paper>{/* <Dashboard/> */}</Paper>
      </InnerLanding>
    </>
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
