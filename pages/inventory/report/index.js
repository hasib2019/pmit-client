import React, { Fragment } from 'react';
import InnerLanding from 'components/shared/layout/InnerLanding';

const Index = (props) => {
  return (
    <Fragment>
      <InnerLanding query={props.query}></InnerLanding>
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
