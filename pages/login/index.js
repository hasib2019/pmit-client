/* eslint-disable react-hooks/rules-of-hooks */
import { Box } from '@mui/system';
import Login from 'components/login/Login';
// import Custom404 from 'pages/404';
// import { useEffect, useState } from 'react';
const index = () => {
  // const [baseUrl, setBaseUrl] = useState();
  // useEffect(() => {
  //   setBaseUrl(`${window.location.hostname}`);
  // }, []);
  return (
    <Box sx={{ heihgt: '100vh' }}>
      {/* {baseUrl === 'coop.rdcd.gov.bd' ? (
        <Custom404 />
      ) : baseUrl === 'loan.rdcd.gov.bd' ? (
        <Custom404 />
      ) : baseUrl === 'accounts.rdcd.gov.bd' ? (
        <Custom404 />
      ) : baseUrl === undefined ? (
        <Custom404 />
      ) : ( */}
      <Login />
      {/* )} */}
    </Box>
  );
};
export default index;
