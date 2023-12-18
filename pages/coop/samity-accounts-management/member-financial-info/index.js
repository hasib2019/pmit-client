/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */

import MemberFinancialInfo from 'components/coop/samity-accounts-management/member-financial-info/MemberFinancialInfo';
import SelectSamity from 'components/shared/common/SelectSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';
const index = () => {
  const title = 'মেম্বার আর্থিক তথ্য';
  const [samityId, setSamityId] = useState();
  const [samityLevel, setSamityLevel] = useState();

  return (
    <Fragment>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SelectSamity {...{ samityId, setSamityId, samityLevel, setSamityLevel }} />
          {samityId && <MemberFinancialInfo {...{ samityId, samityLevel }} />}
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
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
