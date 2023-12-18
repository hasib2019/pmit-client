
/* eslint-disable react-hooks/rules-of-hooks */
import Budget from 'components/coop/samity-management/coop/budget/Budget';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import StepperManu from 'components/shared/others/StyleStepper';
import authentication from 'middleware/Authentication';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageData } from 'service/common';

const index = () => {
  const samityLevel = localStorageData('samityLevel');
  const title =
    samityLevel == 'P'
      ? 'সমিতির বাজেট'
      : samityLevel == 'C'
        ? 'কেন্দ্রিয় সমিতির বাজেট'
        : samityLevel == 'N'
          ? 'জাতীয় সমিতির বাজেট'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 7);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperManu />
        <PaperFormsLayout getValue={title}>
          <Budget />
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
