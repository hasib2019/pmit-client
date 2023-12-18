// **************************************** Create By Md. Hasibuzzaman ************************************

/* eslint-disable react-hooks/rules-of-hooks */
import CenNatMemberRegistration from 'components/coop/samity-management/coop/member-registration/CenNatMemberRegistration';
import MemberRegistration from 'components/coop/samity-management/coop/member-registration/MemberRegistration';
import NationalMemberReg from 'components/coop/samity-management/coop/member-registration/NationalMemberReg';
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
      ? 'সদস্য নিবন্ধন'
      : samityLevel == 'C'
        ? 'সদস্য সমিতি নিবন্ধন'
        : samityLevel == 'N'
          ? 'সদস্য  কেন্দ্রিয় সমিতি নিবন্ধন'
          : '';
  useEffect(() => {
    activePage();
  }, []);

  const activePage = () => {
    localStorage.setItem('activePage', 3);
  };

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <StepperMenu />
        <PaperFormsLayout getValue={title}>
          {samityLevel == 'P' ? (
            <MemberRegistration />
          ) : samityLevel == 'C' ? (
            <CenNatMemberRegistration />
          ) : samityLevel == 'N' ? (
            <NationalMemberReg />
          ) : (
            ''
          )}
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
