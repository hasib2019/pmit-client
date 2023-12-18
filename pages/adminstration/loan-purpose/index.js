import LoanPurpose from 'components/administration/loan-purpose/LoanPurpose';
import requireAuthentication from 'components/mainSections/RouteGuard/HOC';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
export default function Loanpurpose(props) {
  const title = 'ঋণের উদ্দেশ্যের শ্রেণী তৈরি';
  return (
    <InnerLanding query={props.query}>
      <PaperFormsLayout getValue={title}>
        <LoanPurpose />
      </PaperFormsLayout>
    </InnerLanding>
  );
}

export const getServerSideProps = requireAuthentication((context) => {
  return {
    props: {
      query: context.query,
    },
  };
});
