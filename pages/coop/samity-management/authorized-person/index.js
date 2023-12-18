import AuthorizedPerson from 'components/coop/samity-management/authorized-person/AuthorizedPerson';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';
const index = (props) => {
  const title = 'সমিতির অথরাইজড পারসন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <AuthorizedPerson propsData={props} />
      </PaperFormsLayout>
    </InnerLanding>
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
