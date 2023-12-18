import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import HolidaySetup from 'components/mainSections/adminstration/holiday-setup/HolidaySetup';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const index = () => {
  const title = 'হলিডে/ছুটির সেটআপ';

  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue={title}>
          <HolidaySetup />
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
