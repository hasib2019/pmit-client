/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/10/25
 * @modify date 2022-10-25 10:13:48
 * @desc [description]
 */

export const bangToEng = (str) => {
  if (!str) return str;

  str = str.toString();
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

  let containsBengaliNumerals = /[০-৯]/.test(str);

  if (containsBengaliNumerals) {
    let converted = '';

    for (let i = 0; i < str.length; i++) {
      if (str[i] in EnglishNumber) {
        converted += EnglishNumber[str[i]];
      } else {
        converted += str[i];
      }
    }

    return converted;
  } else {
    return str;
  }
};

export const engToBang = (str) => {
  if (!str) return str;
  str = str.toString();
  let BanglaNumber = {
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

  let converted = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] in BanglaNumber) {
      converted += BanglaNumber[str[i]];
    } else {
      converted += str[i];
    }
  }
  return converted;
};

export const numberTranslate = (n, translateTo, returnType) => {
  const mapNumber = {
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

  if (typeof n === 'number') {
    n = n.toString();
  }

  var translatedNumber = '';

  for (var i = 0; i < n.length; i++) {
    if (translateTo == 'Eng') {
      if (mapNumber.hasOwnProperty(n.charAt(i))) {
        //@ts-ignore
        translatedNumber += mapNumber[n.charAt(i)];
      } else {
        translatedNumber += n.charAt(i);
      }
    }

    if (translateTo == 'Ban') {
      if (Object.values(mapNumber).includes(parseInt(n.charAt(i)))) {
        translatedNumber += Object.keys(mapNumber).find(
          //@ts-ignore
          (k) => mapNumber[k] == n.charAt(i),
        );
      } else {
        translatedNumber += n.charAt(i);
      }
    }
  }

  if (returnType == 'number' && translateTo == 'Eng') {
    if (translatedNumber.includes('.')) return parseFloat(translatedNumber);
    return parseInt(translatedNumber);
  }

  return translatedNumber;
};
// NB: const brnData = numberTranslate(resultObj?.value, 'Eng', 'string/Number');

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

export const engToBdNum = (str) => {
  for (var x in banglaNumber) {
    str = str?.replace(new RegExp(x, 'g'), banglaNumber[x]);
  }
  return numberWithCommas(str);
};

function numberWithCommas(x) {
  // var x=12345678;
  x = x.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '') lastThree = ',' + lastThree;
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return res;
}

var numbersE = {
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

export const banglaToEnglishNumber = (input) => {
  let toNumber = input;
  var output = [];
  for (var i = 0; i < toNumber.length; ++i) {
    if (numbersE.hasOwnProperty(toNumber[i])) {
      output.push(numbersE[toNumber[i]]);
    } else {
      output.push(toNumber[i]);
    }
  }
  return output.join('');
};
