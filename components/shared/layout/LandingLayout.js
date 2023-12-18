import { Fragment } from 'react';
import Footer from '../others/Footer';
import NavBar from '../others/NavBar';

const LandingLayout = (props) => {
  return (
    <Fragment>
      <NavBar />
      {props.children}
      <Footer />
    </Fragment>
  );
};

export default LandingLayout;
