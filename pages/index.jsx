/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import AccountsLandingPage from 'components/AccountsLandingPage';
import CoopLandingPage from 'components/CoopLandingPage';
import LoanLandingPage from 'components/LoanLandingPage';
import { Fragment, useEffect, useState } from 'react';

const index = () => {
  const [baseUrl, setBaseUrl] = useState();
  useEffect(() => {
    setBaseUrl(`${window.location.hostname}`);
  }, []);

  return (
    <Fragment>
      {baseUrl == 'coop.rdcd.gov.bd' ? (
        <CoopLandingPage />
      ) : baseUrl == 'stage-coop.rdcd.gov.bd' ? (
        <CoopLandingPage />
      ) : baseUrl == 'loan.rdcd.gov.bd' ? (
        <LoanLandingPage />
      ) : baseUrl == 'stage-loan.rdcd.gov.bd' ? (
        <LoanLandingPage />
      ) : baseUrl == 'accounts.rdcd.gov.bd' ? (
        <AccountsLandingPage />
      ) : baseUrl == 'stage-accounts.rdcd.gov.bd' ? (
        <AccountsLandingPage />
      ) : (
        <CoopLandingPage />
      )}
    </Fragment>
  );
};

export default index;
