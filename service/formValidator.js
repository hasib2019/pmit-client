const mobileRegex = RegExp(/(^(01){1}[3456789]{1}(\d){8})$/);
const regex = /[০-৯]$/;
const parseFloatNumber = /[০-৯/.]$/;
const bangToEng = (str) => {
  let EnglishNumber = {
    '০': 0,
    '১': 1,
    '২': 2,
    '৩': 3,
    '৪': 4,
    '৫': 5,
    '৬': 6,
    '৭': 7,
    '৮': 8,
    '৯': 9,
  };
  for (var x in EnglishNumber) {
    str = str?.replace(new RegExp(x, 'g'), EnglishNumber[x]);
  }
  return str;
};
const engToBang = (str) => {
  let banglaNumber = {
    0: '০',
    1: '১',
    2: '২',
    3: '৩',
    4: '৪',
    5: '৫',
    6: '৬',
    7: '৭',
    8: '৮',
    9: '৯',
  };
  for (var x in banglaNumber) {
    str = str.toString()?.replace(new RegExp(x, 'g'), banglaNumber[x]);
  }
  return str;
};
export const formValidator = (name, value) => {
  let result, returnValue;
  let errorValue = '';
  let resultantObj = {};
  switch (name) {
    case 'nid':
      if (value.length > 17) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length == 11 && value.indexOf(' ') >= 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      value = engToBang(value);
      result = regex.test(value);

      returnValue = result ? value : value.slice(0, -1);
      errorValue = value.length == 10 || value.length == 17 || value.length == 0 ? '' : 'আপনার সঠিক এনআইডি প্রদান করুন';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'brn':
      if (value.length == 18) {
        return (resultantObj = {
          status: 'true',
        });
      }
      value = engToBang(value);
      result = regex.test(value);

      returnValue = result ? value : value.slice(0, -1);
      errorValue = value.length == 17 || value.length == 0 ? '' : 'আপনার সঠিক জন্ম নিবন্ধন (১৭ ডিজিট) প্রদান করুন';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'mobile':
      if (value.length > 11) {
        return (resultantObj = {
          status: 'true',
        });
      }

      value = engToBang(value);
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      errorValue = mobileRegex.test(bangToEng(value)) ? '' : 'আপনার সঠিক মোবাইল নং প্রদান করুন';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'number':
      if (value.length > 15) {
        return (resultantObj = {
          status: 'true',
        });
      }

      value = engToBang(value);
      result = parseFloatNumber.test(value);
      returnValue = result ? value : value.slice(0, -1);
      errorValue = '';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
  }
};
