// import { config } from "./config";
import { NotificationManager } from 'react-notifications';
import { errorHandler } from 'service/errorHandler';
import axios from 'axios';
import { localStorageData } from 'service/common';

export const getApi = async (url, method, data) => {
  const config = localStorageData('config');
  let res;
  try {
    if (method === 'get') {
      res = await axios.get(url, config);
      return res;
    }
    if (method === 'post') {
      //("post data---------", data)
      if (data === undefined || null) {
        NotificationManager.error('Data isnot provided', '', 5000);
      }
      res = await axios.post(url, data, config);
      return res;
    }
    if (method === 'put') {
      //("put data---------", data)
      if (data === undefined || null) {
        NotificationManager.error('Data isnot provided', '', 5000);
      }
      res = await axios.put(url, data, config);
      return res;
    }
  } catch (error) {
    errorHandler(error);
    //  if(error.message){
    //   let message ="ডাটাবেস এর সাথে সংযোগ সম্পন্ন হচ্ছে না"
    //     NotificationManager.error(message, "", 5000);
    //  }
    // else if (error.response) {
    //   ("error found", error.response.data);
    //   let message = error?.response?.data?.errors?.[0]?.message;
    //   NotificationManager.error(message, "", 5000);
    // } else if (error.request) {
    //   NotificationManager.error("Error Connecting...", "", 5000);
    // } else if (error) {
    //   NotificationManager.error(error.toString(), "", 5000);
    // }
  }
};
