import { liveIp } from 'config/IpAddress';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'service/AxiosInstance';
import { localStorageData } from 'service/common';
const UseActivityLog = () => {
  const compoName = localStorageData('componentName');

  const router = useRouter();

  const currentUrl = router.asPath.split('?')[0];

  useEffect(() => {
    if (currentUrl !== '/login') {
      if (compoName) {
        axios.post(liveIp + `activity/${compoName}`, {
          activity: {
            url: currentUrl,
          },
        });
      }
    }
  }, [currentUrl]);
  return {
    currentUrl: currentUrl,
  };
};

export { UseActivityLog };
