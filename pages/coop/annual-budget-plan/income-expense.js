// **************************************** Create By Md. Hasibuzzaman ************************************

/* eslint-disable react-hooks/rules-of-hooks */
import IncomeExpense from 'components/coop/annual-budget-plan/income-expense';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageData } from 'service/common';

const index = () => {
  // const title = " সমিতির জমা খরচের হিসাব";
  const samityLevel = localStorageData('samityLevel');
  const title =
    samityLevel == 'P'
      ? 'সমিতির আয় ব্যয়ের হিসাব'
      : samityLevel == 'C'
        ? 'কেন্দ্রিয় সমিতির আয় ব্যয়ের হিসাব'
        : samityLevel == 'N'
          ? 'জাতীয় সমিতির আয় ব্যয়ের হিসাব'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 6);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <IncomeExpense />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;
// export const getServerSideProps = authentication((context) => {
//   return {
//     props: {
//       query: context.query,
//     },
//   };
// });
