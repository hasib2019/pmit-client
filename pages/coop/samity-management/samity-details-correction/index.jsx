/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/08/10 10:00:48
 * @modify date 2022-08-10
 * @desc [description]
 */
import SamityDetailsCorrection from 'components/coop/samity-management/samity-correction.jsx/SamityDetailsCorrection';
import SelectSamity from 'components/shared/common/SelectSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';

const Index = () => {
  const title = 'সমিতির অন্যান্য তথ্য সংশোধন';
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
          {samityId && <SamityDetailsCorrection {...{ samityId }} />}
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
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
