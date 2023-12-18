/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 14:26:06
 * @modify date 2022-11-03 14:26:06
 * @desc [description]
 */

import UploadDpsFdr from 'components/mainSections/migration/uploadDpsFdr';
import { Fragment } from 'react';

import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = (props) => {
  const title = 'ডি পি এস/এফ ডি আর এর তথ্য আপলোড';
  return (
    <Fragment>
      <InnerLanding query={props.query}>
        <PaperFormsLayout getValue={title}>
          <UploadDpsFdr />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
