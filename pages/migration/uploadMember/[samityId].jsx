/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import MemberUpload from 'components/mainSections/migration/UploadMember';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Index = () => {
  const title = 'মেম্বারের তথ্য আপলোড';

  const router = useRouter();
  const { samityId } = router.query;

  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <MemberUpload samityId={samityId} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
