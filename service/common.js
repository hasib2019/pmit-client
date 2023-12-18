/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
import jwt from 'jsonwebtoken';

export const localStorageData = (data) => {
  if (data == 'token') {
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
  } else if (data == 'config') {
    ///////////////////////////////////////*** config ***//////////////////////////////////////////
    const tokenAccessData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
    const config = {
      headers: {
        Authorization: `Bearer ${tokenAccessData}`,
      },
    };
    return config;
  } else if (data == 'getSamityId') {
    ////////////////////////////////////////*** getSamityId ***////////////////////////////////////////
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('storeId')) : null;
  } else if (data == 'getSamityName') {
    ////////////////////////////////////////*** getSamityName ***////////////////////////////////////////
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('storeName')) : null;
  } else if (data == '9') {
    ////////////////////////////////////////*** statusId ***////////////////////////////////////////
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('status')) : null;
  } else if (data == 'stepeer') {
    /////////////////////////////////////// *** stepeer ***///////////////////////////////////////////
    const stepper = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('stepId')) : null;
    if (stepper == null) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('stepId', JSON.stringify(0));
      }
    } else {
      return stepper;
    }
  } else if (data == 'componentName') {
    return typeof window !== 'undefined' ? localStorage.getItem(data) : null;
  } else {
    return typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(data)) : null;
  }
};

///////////////////////////////////////*** TokenData parse ***///////////////////////////////////////////

export const tokenData = () => {
  const tokenAccessData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
  const tokenDecode = jwt.decode(tokenAccessData);
  if (tokenDecode) {
    return tokenDecode;
  }
};

////////////////////////////////////////*** latest samity data setup in localstorage ***///////////////////
export const setLatestSamityData = (data) => {
  const reportsId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('reportsId')) : null;
  const reportsIdPer = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('reportsIdPer')) : null;
  if (data.length != 0) {
    if (reportsId == null) {
      if (data[0].flag == 'temp') {
        localStorage.setItem('reportsId', JSON.stringify(data[0].id));
      }
      localStorage.setItem('status', JSON.stringify(data[0].flag == 'approved' ? 'A' : 'P'));
      localStorage.setItem('approvedSamityLevel', JSON.stringify(data[0].samityLevel));
    }
    if (reportsIdPer == null) {
      localStorage.setItem('reportsIdPer', JSON.stringify(data[0].id));
      localStorage.setItem('status', JSON.stringify(data[0].flag == 'approved' ? 'A' : 'P'));
      localStorage.setItem('approvedSamityLevel', JSON.stringify(data[0].samityLevel));
    }
  }
};

//////////////////////////////////////////*** remaining time calculation ***////////////////////////////////////////
export const timeFound = (time) => {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'seconds', 1], // 60
    [120, '1 minute ago', '1 minute from now'], // 60*2
    [3600, 'minutes', 60], // 60*60, 60
    [7200, '1 hour ago', '1 hour from now'], // 60*60*2
    [86400, 'hours', 3600], // 60*60*24, 60*60
    [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
    [604800, 'days', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = 'ago',
    list_choice = 1;

  if (seconds == 0) {
    return 'Just now';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = 'from now';
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == 'string') return format[list_choice];
      else return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
    }
  return time;
};

export const removeSelectedValue = (value) => {
  return value == 'নির্বাচন করুন' ? null : value;
};
export function isRichValue(value) {
  return Boolean(value && Array.isArray(value.richText));
}

export function richToString(rich) {
  return rich.richText.map(({ text }) => text).join('');
}
