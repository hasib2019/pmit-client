// ************************************ Updated by Hasibuzzaman***************************************

/* eslint-disable react-hooks/rules-of-hooks */
import SamityRegReport from 'components/coop/samity-management/coop/samity-reg-report/SamityRegReport';
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
      ? 'প্রাথমিক সমবায় সমিতি নিবন্ধনের আবেদন'
      : samityLevel == 'C'
        ? 'কেন্দ্রিয় সমবায় সমিতি নিবন্ধনের আবেদন'
        : samityLevel == 'N'
          ? 'জাতীয় সমবায় সমিতি নিবন্ধনের আবেদন'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 9);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title}>
          <SamityRegReport />
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
