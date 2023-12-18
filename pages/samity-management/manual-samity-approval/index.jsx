/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import SamityApprovalList from 'components/mainSections/migration/approval/SamityApprovalList';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { Fragment } from 'react';

const Index = () => {
  const title = 'আপলোডেড সমিতির তথ্য';
  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SamityApprovalList />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
