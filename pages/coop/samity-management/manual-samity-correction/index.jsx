/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023/10/23 10:00:48
 * @modify date 2023/10/23
 * @desc [description]
 */
import ManualSamityCorrection from 'components/coop/samity-management/manual-samity-correction/ManualSamityCorrection';
import SelectManualSamity from 'components/shared/common/SelectManualSamity';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';

const Index = () => {
  const title = 'সমিতি অনলাইনকরন সংশোধন';
  const [samityId, setSamityId] = useState();
  const [samityLevel, setSamityLevel] = useState();
  console.log({ samityId });
  return (
    <Fragment>
      <Helmet>
        <title>RDCD- {title}</title>
      </Helmet>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SelectManualSamity {...{ samityId, setSamityId, samityLevel, setSamityLevel }} />
          {samityId && <ManualSamityCorrection {...{ samityId }} />}
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
