/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/04 10.00.00
 * @modify date 202207/04 10:00:00
 * @desc [description]
 */
import ReportTemplete from 'components/utils/coop/ReportTemplete';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';

const CitizenReport = () => {
  const router = useRouter();
  const config = localStorageData('config');
  const samityReportId = localStorageData('samityInfo');
  const reportPageCheck = (id) => {
    if (id == null) {
      router.push({ pathname: '/dashboard' });
      const message = 'আপনি কোন সমিতি নিবন্ধন করেন নি ।';
      NotificationManager.warning(message, '', 5000);
    }
  };

  useEffect(() => {
    reportPageCheck(samityReportId?.id);
  }, [samityReportId]);
  return (
    <>
      <ReportTemplete {...{ samityReportId, config }} />
    </>
  );
};

export default CitizenReport;
