/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-11-23 02:26:00 PM last modification
 * @desc [description]
 */
import Router from 'next/router';
import { NotificationManager } from 'react-notifications';
import { localStorageData, tokenData } from './common';
import { userService } from './userService';

export function errorHandler(error) {
  const token = localStorageData('token');
  const userData = tokenData(token);
  if (error?.response?.status == 400) {
    error?.response?.data?.errors?.map((row) => NotificationManager.error(row.message, '', 5000));
  } else if (error?.response?.status == 401) {
    const message = 'অননুমোদিত ব্যক্তি, দয়া করে পুনরায় চেষ্টা করুন';
    NotificationManager.warning(message, '', 5000);
    if (userData) {
      Router.push('/dashboard');
    } else {
      userService.logout(userData);
    }
  } else if (error?.response?.status == 403) {
    const message = 'অননুমোদিত ব্যক্তি, দয়া করে পুনরায় চেষ্টা করুন';
    NotificationManager.warning(message, '', 5000);
    if (userData) {
      Router.push('/dashboard');
    } else {
      userService.logout(userData);
    }
  } else if (error?.response?.status == 404) {
    const message = error?.response?.data?.messageBangla || error?.response?.data?.errors[0].message;
    NotificationManager.error(message, '', 5000);
  } else if (error?.response?.status == 500) {
    const message = 'দয়া করে আপনার ইন্টারনেট সংযোগটি পর্যবেক্ষণ করুন';
    NotificationManager.error(message, '', 5000);
  } else if (error?.request) {
    NotificationManager.error('দয়া করে আপনার ইন্টারনেট সংযোগটি পর্যবেক্ষণ করুন', '', 5000);
  } else if (error) {
    NotificationManager.error(error.toString(), '', 5000);
  }
}
