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

export const engToBdNum = (str) => {
  for (var x in EnglishNumber) {
    str = str?.replace(new RegExp(x, 'g'), EnglishNumber[x]);
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

export const bdToNum = (str) => {
  for (var x in EnglishNumber) {
    str = str?.replace(new RegExp(x, 'g'), EnglishNumber[x]);
  }
  return str;
};
