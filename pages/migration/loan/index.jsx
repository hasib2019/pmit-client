/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import UploadedLoanInfos from 'components/mainSections/migration/UploadedLoanInfo';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = () => {
  const title = 'আপলোডেড ঋণের তথ্য';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <UploadedLoanInfos mode="loanInfoMigration" />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
