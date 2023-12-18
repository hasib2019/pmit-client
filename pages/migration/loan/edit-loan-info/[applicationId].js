import UploadMember from 'components/mainSections/migration/UploadMember';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const Index = () => {
  const title = 'লোণের তথ্য';
  const router = useRouter();
  const { samityId, mode, customerOldCode } = router.query;

  return (
    <Fragment>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <UploadMember samityId={samityId} mode={mode} customerOldCode={customerOldCode} />
        </PaperFormsLayout>
      </InnerLanding>
    </Fragment>
  );
};

export default Index;
