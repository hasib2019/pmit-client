import React from 'react';
import InnerLanding from 'components/shared/layout/InnerLanding';
import DataSynchronization from 'components/mainSections/data-synchronization/DataSynchronization';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const index = () => {
  const title = 'তথ্য সিঙ্ক্রোনাইজেশন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <DataSynchronization />
      </PaperFormsLayout>
    </InnerLanding>
  );
};

export default index;
