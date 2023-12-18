import ItemRetun from 'components/inventory/mainSections/itemReturn/itemReturn';
import InnerLanding from 'components/shared/layout/InnerLanding';
import PaperFormsLayout from 'components/shared/layout/PaperFormsLayout';
const Index = () => {
  return (
    <>
      <InnerLanding>
        <PaperFormsLayout getValue="স্টোরে ফেরত অনুরোধ">
          <ItemRetun />
        </PaperFormsLayout>
      </InnerLanding>
    </>
  );
};
export default Index;
export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
