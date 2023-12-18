
import axios from 'axios';
import Loader from 'components/shared/others/Loader';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { samityInfo } from '../../url/coop/ApiList';
const Samitycode = () => {
  const router = useRouter();
  const { samitycode } = router.query;
  useEffect(() => {
    getSamityInfo(samitycode);
  }, [samitycode]);

  let getSamityInfo = async (getSamityCode) => {
    try {
      const samityDataInfo = await axios.get(samityInfo + `?samityCode=${getSamityCode}`);
      let samityDataList = samityDataInfo.data.data;
      if (samityDataList[0]?.id) {
        localStorage.setItem('reportsIdPer', samityDataList[0]?.id);
        router.push({ pathname: '/coop/web-portal' }, '/' + samityDataList[0]?.samityCode);
      } else {
        localStorage.removeItem('reportsIdPer');
        router.push({ pathname: '/coop/web-portal' }, '/' + samitycode);
      }
    } catch (error) {
      //
    }
  };
  return <Loader />;
};

export default Samitycode;
