// ************************************ Developed by Hritik***************************************
// ************************************ modified by Saiful***************************************
// ************************************ Updated by Hasibuzzaman***************************************

import SamityCategory from 'components/coop/samity-management/coop/samity-category/SamityCategory';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'সমিতির ধরন';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <SamityCategory />
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
