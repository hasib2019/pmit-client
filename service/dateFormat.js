/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-06-08 10:13:48
 * @desc [description]
 */
import moment from 'moment';
///////////////////////////////////// *** for show data in frontend *** //////////////////////////////////////
export const dateFormat = (date) => moment(date).format('DD/MM/YYYY');
////////////////////////////////////// *** Date formet for data base ***//////////////////////////////////////
// export const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US");
//   };
export const formatDate = (date) => moment(date).format('DD/MM/YYYY');
