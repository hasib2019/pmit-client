// **************************************Development By Md. Hasibuzzaman****************************************

/* eslint-disable react-hooks/rules-of-hooks */
import CanNatDesignation from 'components/coop/samity-management/coop/designation/CanNatDesignation';
import Designation from 'components/coop/samity-management/coop/designation/Designation';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import StepperMenu from 'components/shared/others/StyleStepper';
import authentication from 'middleware/Authentication';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageData } from 'service/common';

const index = () => {
  const samityLevel = localStorageData('samityLevel');
  const title =
    samityLevel == 'P'
      ? 'কমিটির পদবী বরাদ্দকরন'
      : samityLevel == 'C'
        ? 'কেন্দ্রিয় সমিতির কমিটির পদবী বরাদ্দকরন'
        : samityLevel == 'N'
          ? 'জাতীয় সমিতির কমিটির পদবী বরাদ্দকরন'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 4);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title}>
          {samityLevel == 'P' ? <Designation /> : ''}
          {samityLevel == 'C' || samityLevel == 'N' ? <CanNatDesignation /> : ''}
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;
export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
