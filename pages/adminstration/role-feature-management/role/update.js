import React from 'react';
import Head from 'next/head';
import UpdateRole from 'components/mainSections/adminstration/role-feature-management/role/UpdateRole';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';

const Update = () => {
  const title = 'রোল হালনাগাদ';
  return (
    <>
      <Head>
        <title>RDCD- {title}</title>
      </Head>

      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <UpdateRole />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};

export default Update;
