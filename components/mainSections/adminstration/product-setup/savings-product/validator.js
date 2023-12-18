
const mobileRegex = RegExp(/(^(01){1}[3456789]{1}(\d){8})$/);
// const regex = /[০-৯.,]$/;
const regex = /[0-9.,]$/;
export const bangToEng = (str) => {
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
  if (str) {
    str = str.toString();
    for (var x in EnglishNumber) {
      str = str?.replace(new RegExp(x, 'g'), EnglishNumber[x]);
    }
  }
  return str;
};
export const engToBang = (str) => {
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
  if (str || str == '0') {
    for (var x in banglaNumber) {
      str = str.toString()?.replace(new RegExp(x, 'g'), banglaNumber[x]);
    }
  }
  return str;
};
export const myValidate = (name, value) => {
  let result, result2, returnValue, str, resultChargeQuantityInEnglish;
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
      result = regex.test(value);

      returnValue = result ? value : value.slice(0, -1);
      errorValue = value.length == 10 || value.length == 17 || value.length == 0 ? '' : 'আপনার সঠিক এনআইডি প্রদান করুন';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'brn':
      if (value.length == 20) {
        return (resultantObj = {
          status: 'true',
        });
      }
      value = engToBang(value);
      result = regex.test(value);

      returnValue = result ? value : value.slice(0, -1);
      errorValue = value.length == 17 || value.length == 0 ? '' : 'আপনার সঠিক জন্ম নিবন্ধন প্রদান করুন';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'annualIncome':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 15) {
        return (resultantObj = {
          status: 'true',
        });
      }

      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'number':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 2) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'threeNumber':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 3) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;


    case 'fourNumber':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 4) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'docLengthVal':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 6) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'loanTerm':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 8) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    // case "featureCode":
    //   if (value.length == 1 && value == 0) {
    //     return resultantObj = {
    //       status: "true"
    //     };
    //   }
    //   if (value.length > 5) {
    //     return resultantObj = {
    //       status: "true"
    //     };
    //   }
    //     value = engToBang(value);
    //     result = regex.test(value);
    //     returnValue = result ? value : value.slice(0, -1)
    //     resultantObj = {
    //       value: returnValue,
    //       error: errorValue
    //     }
    //     return resultantObj;
    //   break;

    case 'mobile':
      if (value.length > 11) {
        return (resultantObj = {
          status: 'true',
        });
      }

      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);
      errorValue = mobileRegex.test(value) ? '' : 'আপনার সঠিক মোবাইল নং প্রদান করুন';
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'postOffice':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }
      if (value.length > 4) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);

      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'bankAcc':
      if (value.length > 15) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);

      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;

    case 'percentage':
      if (value.length == 1 && value == 0) {
        return (resultantObj = {
          status: 'true',
        });
      }

      str = value;
      if (Number(str) > 100) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result = regex.test(value);
      returnValue = result ? value : value.slice(0, -1);

      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'chargeNumber':
      if (value.length > 8) {
        return (resultantObj = {
          status: 'true',
        });
      }
      resultChargeQuantityInEnglish;
      resultChargeQuantityInEnglish = regex.test(value);
      returnValue = resultChargeQuantityInEnglish ? value : value.slice(0, -1);

      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
    case 'numberOfInstallment':
      if (value.length > 3) {
        return (resultantObj = {
          status: 'true',
        });
      }
      result2 = regex.test(value);
      returnValue = result2 ? value : value.slice(0, -1);
      resultantObj = {
        value: returnValue,
        error: errorValue,
      };
      return resultantObj;
  }
};
