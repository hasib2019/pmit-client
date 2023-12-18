
/**
 * @author Md Saifur Rahman
 * @email saifur1985bd@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */
import AuditAccountsInformation from 'components/coop/samity-accounts-management/audit-accounts-information/AuditAccountsInformation';
import SelectSamity from 'components/shared/common/SelectSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

const Index = () => {
  const title = 'হিসাবের তথ্য সংযোজনের আবেদন';
  const [samityId, setSamityId] = useState();
  const [samityLevel, setSamityLevel] = useState();

  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SelectSamity {...{ samityId, setSamityId, samityLevel, setSamityLevel }} />
          {samityId && <AuditAccountsInformation {...{ samityId, isApproval: false }} />}
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default Index;

export const getServerSideProps = authentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
