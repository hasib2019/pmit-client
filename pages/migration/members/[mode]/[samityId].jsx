/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import UploadMember from 'components/mainSections/migration/UploadMember';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Index = () => {
  const title = 'আপলোডেড মেম্বারের তথ্য';

  const router = useRouter();
  const { samityId, mode, customerOldCode } = router.query;

  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <UploadMember samityId={samityId} mode={mode} customerOldCode={customerOldCode} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
