
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2022/07/28 10:13:48
 * @modify date 2022/07/28 10:13:48
 * @desc [description]
 */
import BanglaDate from './inputItem/BanglaDate';
import DesktopDate from './inputItem/DesktopDate';
import ImageItem from './inputItem/ImageItem';
import InputRadioItem from './inputItem/InputRadioItem';
import SelectItem from './inputItem/SelectItem';
import SelectSerchItem from './inputItem/SelectSerchItem';
import TextFields from './inputItem/TextFieldItem';

const FormControlJSON = (props) => {
  return (
    <>
      {props.arr.map((row, i) =>
        (() => {
          switch (row.viewType) {
            case 'textField':
              return <TextFields {...{ row, i }} />;
            case 'select':
              return <SelectItem {...{ row, i }} />;
            case 'date':
              return <DesktopDate {...{ row, i }} />;
            case 'dateBangla':
              return <BanglaDate {...{ row, i }} />;
            case 'inputRadio':
              return <InputRadioItem {...{ row, i }} />;
            case 'file':
              return <ImageItem {...{ row, index: row.index }} />;
            case 'selectSearch':
              return <SelectSerchItem {...{ row, i }} />;
            default:
              return null;
          }
        })(),
      )}
    </>
  );
};

export default FormControlJSON;
