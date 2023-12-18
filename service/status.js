/**
 * @author Md Saifur Rahman
 * @Modifier Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
export function StatusCheck(data) {
  let text;
  switch (data) {
    case 'A':
      text = 'Active';
      break;
    case 'P':
      text = 'Pending';
      break;
    case 'R':
      text = 'Rejected';
      break;
  }
  return text;
}
