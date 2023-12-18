
/* eslint-disable react-hooks/rules-of-hooks */
import CanNatMemberExp from 'components/coop/samity-management/coop/member-expenditure/CanNatMemberExp';
import MemberExp from 'components/coop/samity-management/coop/member-expenditure/MemberExp';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import StepperMenu from 'components/shared/others/StyleStepper';
import authentication from 'middleware/Authentication';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { localStorageData } from 'service/common';

const index = () => {
  // const title = "সদস্যের আর্থিক তথ্যাদি";
  const samityLevel = localStorageData('samityLevel');
  const title =
    samityLevel == 'P'
      ? 'সদস্যের আর্থিক তথ্যাদি'
      : samityLevel == 'C'
        ? 'সদস্য কেন্দ্রিয় সমিতি আর্থিক তথ্যাদি'
        : samityLevel == 'N'
          ? 'সদস্য জাতীয় সমিতির আর্থিক তথ্যাদি'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 5);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title}>
          {samityLevel == 'P' ? <MemberExp /> : ''}
          {samityLevel == 'C' || samityLevel == 'N' ? <CanNatMemberExp /> : ''}
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
