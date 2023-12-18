import DocMap from 'components/coop/setup/doc-mapping/DocMapping';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
import authentication from 'middleware/Authentication';

const index = () => {
  const title = 'সমবায় সমিতির ধরন';
  return (
    <InnerLanding>
      <PaperFormsLayout getValue={title}>
        <DocMap />
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
