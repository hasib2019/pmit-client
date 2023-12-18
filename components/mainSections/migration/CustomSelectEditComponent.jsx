/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2023-06-21 11:27:58
 * @modify date 2023-06-21 11:27:58
 * @desc [description]
 */

import { GridEditSingleSelectCell } from '@mui/x-data-grid';
import { Component } from 'react';

class CustomSelectEditComponent extends Component {
  handleValueChange = async (e) => {
    const { getselectvalue } = this.props;

    if (typeof e.target.value == 'number') {
      await getselectvalue(e.target.value);
    }
  };

  render() {
    const { value, ...other } = this.props;
    return <GridEditSingleSelectCell value={value || ''} onValueChange={this.handleValueChange} {...other} />;
  }
}

export default CustomSelectEditComponent;
