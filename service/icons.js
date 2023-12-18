/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/05/01
 * @modify date 2022-11-03 12:11:53
 * @desc [description]
 */
import AlbumIcon from '@mui/icons-material/Album';
import { iconList } from './IconList';
const iconProvider = (id) => {
  const iconItem = <AlbumIcon />;
  const findItem = iconList.find((item) => item.id == id);
  if (findItem) {
    return findItem.icon;
  } else {
    return iconItem;
  }
};
export default iconProvider;
