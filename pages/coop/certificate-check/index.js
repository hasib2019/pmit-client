/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2023-02-27 10:41:18
 * @desc [description]
 */
import CertifiateCheck from 'components/coop/certificate-check/CertifiateCheck';
const index = (props) => {
  const { query } = props;
  return <CertifiateCheck checkData={query} />;
};
export async function getServerSideProps(context) {
  return {
    props: {
      query: context.query,
    },
  };
}
export default index;
