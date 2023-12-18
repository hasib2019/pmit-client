/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48 AM
 * @modify date 2023-04-18 02:15:00 PM
 * @desc [description]
 */
import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { errorHandler } from 'service/errorHandler';

export const FetchWrapper = {
  get,
  post,
  put,
  deleteId,
  patch,
};

async function get(url) {
  try {
    if (url) {
      const config = localStorageData('config');
      const data = await axios.get(url, config);
      const samityData = data.data.data;
      return samityData;
    }
  } catch (error) {
    errorHandler(error);
  }
}

async function post(url, data) {
  try {
    if (url) {
      const config = localStorageData('config');
      if (data === undefined || null) {
        NotificationManager.error('আপনি কোন ডাটা প্রদান করেন নাই', '', 5000);
      }
      const res = await axios.post(url, data, config);
      const respose = res.data;
      return respose;
    }
  } catch (error) {
    errorHandler(error);
  }
}

async function patch(url, data) {
  try {
    if (url) {
      const config = localStorageData('config');
      if (data === undefined || null) {
        NotificationManager.error('আপনি কোন ডাটা প্রদান করেন নাই', '', 5000);
      }
      const res = await axios.patch(url, data, config);
      const respose = res.data.data;
      NotificationManager.success('হালনাগাদ সম্পন্ন হয়েছে', '', 2000);
      return respose;
    }
  } catch (error) {
    errorHandler(error);
  }
}

async function put(url, data) {
  try {
    if (url) {
      const config = localStorageData('config');
      if (data === undefined || null) {
        NotificationManager.error('আপনি কোন ডাটা প্রদান করেন নাই', '', 5000);
      }
      const res = await axios.put(url, data, config);
      const response = res.data.data;
      return response;
    }
  } catch (error) {
    errorHandler(error);
  }
}

async function deleteId(url, id) {
  try {
    if (url) {
      const config = localStorageData('config');
      if (id === undefined || null) {
        NotificationManager.error('আপনি কোন ডাটা প্রদান করেন নাই', '', 5000);
      }
      const res = await axios.delete(url + '/' + id, config);
      const response = res.data.data;
      return response;
    }
  } catch (error) {
    errorHandler(error);
  }
}
