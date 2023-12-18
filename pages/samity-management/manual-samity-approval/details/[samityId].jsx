/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import SamityApproval from 'components/mainSections/migration/approval/SamityApprovalDetails';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Index = () => {
  const title = 'সামিতি ও মেম্বারের তথ্য';
  const router = useRouter();
  const { samityId } = router.query;

  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SamityApproval samityId={samityId} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
