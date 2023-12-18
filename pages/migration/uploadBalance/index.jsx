/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import { Fragment } from 'react';
import UploadBalance from 'components/mainSections/migration/UploadBalance';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Index = () => {
  const title = 'ব্যালেন্সের তথ্য';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <UploadBalance />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
