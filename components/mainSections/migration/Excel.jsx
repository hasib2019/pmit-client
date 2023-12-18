/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2023-01-15 13:03:01
 * @modify date 2023-01-15 13:03:01
 * @desc [description]
 */

import { Button, Grid } from '@mui/material';
import axios from 'axios';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { Component } from 'react';
import { localStorageData } from 'service/common';
import { glListRoute } from '../../../url/ApiList';

class ExcelCreate extends Component {
  state = {
    data: [],
  };

  getConfig = () => {
    return localStorageData('config');
  };

  getGLList = async () => {
    const response = await axios.get(glListRoute, {
      params: {
        isPagination: false,
        parentChild: 'C',
      },
      ...this.getConfig(),
    });

    if (response.status == 200) {
      const data = response.data.data;
      this.setState({ data: this.parseData(data) });
    }
  };

  async componentDidMount() {
    await this.getGLList();
  }

  createWorkbook = async () => {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('balance_migration');

    worksheet.columns = [
      { header: 'GL Id', key: 'id', width: 10 },
      { header: 'Gl Code', key: 'glCode', width: 10 },
      { header: 'Gl Name', key: 'glName', width: 32 },
      { header: 'Debit Balance', key: 'debitBalance', width: 12 },
      { header: 'Credit Balance', key: 'creditBalance', width: 12 },
    ];

    worksheet.addRows(this.state.data);

    await workbook.xlsx.writeBuffer().then(function (data) {
      var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'balance.xlsx');
    });
  };

  parseData = (data) => {
    const sortedData = data.sort((a, b) => {
      // Sort by glCode in ascending order
      if (a.glacCode < b.glacCode) return -1;
      if (a.glacCode > b.glacCode) return 1;
      return 0;
    });

    return sortedData.map((d) => {
      return {
        id: d.id,
        glCode: d.glacCode,
        glName: d.glacName,
        debitBalance: '',
        creditBalance: '',
      };
    });
  };

  render() {
    return (
      <Grid sx={{ width: '100%' }}>
        <Button onClick={this.createWorkbook}>ডাউনলোড</Button>
      </Grid>
    );
  }
}

export default ExcelCreate;
