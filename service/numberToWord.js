/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
var numbersE = {
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

export function numberToWord(input) {
  let toNumber = input;
  var output = [];
  for (var i = 0; i < toNumber?.length; ++i) {
    if (numbersE.hasOwnProperty(toNumber[i])) {
      output.push(numbersE[toNumber[i]]);
    } else {
      output.push(toNumber[i]);
    }
  }
  return output.join('');
}
