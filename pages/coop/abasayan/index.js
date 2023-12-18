
/* eslint-disable react-hooks/rules-of-hooks */
/**
 * @author Md Saifur Rahman
 * @email saifur1985bd@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */

import Abasayan from 'components/coop/abasayan/Abasayan';
import SelectSamity from 'components/shared/common/SelectSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { tokenData } from 'service/common';

const index = () => {
  const title = 'অবসায়নের প্রস্তাব আবেদন';
  const titleBo = 'অবসায়নের প্রস্তাব সুপারিশ';
  const userData = tokenData();
  const [samityId, setSamityId] = useState();
  const [samityLevel, setSamityLevel] = useState();
  return (
    <>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={userData?.type == 'user' ? titleBo : title}>
          <SelectSamity {...{ samityId, setSamityId, samityLevel, setSamityLevel }} />
          {samityId && <Abasayan {...{ samityId, samityLevel }} />}
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
