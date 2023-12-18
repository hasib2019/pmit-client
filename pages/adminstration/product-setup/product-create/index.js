import React from 'react';
import CreateProduct from 'components/mainSections/adminstration/product-setup/product-create/CreateProduct';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
const index = () => {
  const title = 'ঋণ প্রোডাক্ট তৈরী';
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <CreateProduct />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default index;

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
