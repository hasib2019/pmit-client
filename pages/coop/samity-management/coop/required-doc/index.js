// **************************************Development By Md. Hasibuzzaman****************************************
// **************************************** Create By Md. Hasibuzzaman ************************************

/* eslint-disable react-hooks/rules-of-hooks */
import RequiredDoc from 'components/coop/samity-management/coop/required-doc/RequiredDoc';
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
      ? 'সমিতির ডকুমেন্ট সংরক্ষন'
      : samityLevel == 'C'
        ? 'কেন্দ্রিয় সমিতির ডকুমেন্ট সংরক্ষন'
        : samityLevel == 'N'
          ? 'জাতীয় সমিতির ডকুমেন্ট সংরক্ষন'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 8);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title}>
          <RequiredDoc />
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
