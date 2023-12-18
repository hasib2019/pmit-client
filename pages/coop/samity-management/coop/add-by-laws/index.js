// **************************************** Create By Md. Hasibuzzaman ************************************

/* eslint-disable react-hooks/rules-of-hooks */
import AddByLaws from 'components/coop/samity-management/coop/add-by-laws/AddByLaws';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import StepperMenu from 'components/shared/others/StyleStepper';
import Authentication from 'middleware/Authentication';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageData } from 'service/common';

const index = () => {
  const samityLevel = localStorageData('samityLevel');
  const title =
    samityLevel == 'P'
      ? 'লক্ষ্য ও উদ্দেশ্য সংযোজন করুন'
      : samityLevel == 'C'
        ? 'কেন্দ্রিয় সমিতির লক্ষ্য ও উদ্দেশ্য সংযোজন করুন'
        : samityLevel == 'N'
          ? 'জাতীয় সমিতির লক্ষ্য ও উদ্দেশ্য সংযোজন করুন'
          : '';

  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 2);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title}>
          <AddByLaws />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;
export const getServerSideProps = Authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
