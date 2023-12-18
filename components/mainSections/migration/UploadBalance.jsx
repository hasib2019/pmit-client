/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-03 15:46:51
 * @modify date 2022-11-03 15:46:51
 * @desc [description]
 */

import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import axios from 'axios';
import Exceljs from 'exceljs';
import Joi from 'joi-browser';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, removeSelectedValue, tokenData } from 'service/common';
import { balanceMigration, employeeRecord, loanProject } from '../../../url/ApiList';
import BalanceTable from './BalanceTable';
import ExcelCreate from './Excel';

class UploadBalance extends Component {
  state = {
    editable: true,
    open: false,
    uploadButton: false,
    file: null,
    data: [],
    errors: {},
    selectedOfficer: '',
    selectedProject: '',
    officers: [],
    projects: [],
    columns: [
      {
        headerName: '#',
        filterable: false,
        width: 50,
        renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
      },
      {
        headerName: 'লেজারের আইডি',
        field: 'id',
        width: 150,
        editable: false,
        type: 'string',
      },
      {
        headerName: 'লেজারের কোড',
        field: 'glCode',
        width: 150,
        editable: false,
        type: 'string',
      },
      {
        headerName: 'লেজারের নাম',
        field: 'glName',
        width: 250,
        editable: false,
        type: 'string',
      },
      {
        headerName: 'ডেবিট ব্যালেন্স',
        field: 'debitBalance',
        width: 150,
        editable: true,
        type: 'number',
      },
      {
        headerName: 'ক্রেডিট ব্যালেন্স',
        field: 'creditBalance',
        width: 150,
        editable: true,
        type: 'number',
      },
      {
        field: 'সম্পাদনা',
        width: 150,
        type: 'actions',
        headerName: 'Actions',
        cellClassName: 'actions',
        getActions: ({ row }) => {
          return [
            <Button
              key={row.id}
              variant="outlined"
              color="error"
              onClick={() => this.handleDeleteClick(row.id)}
              size="small"
            >
              <Close></Close>
            </Button>,
          ];
        },
      },
    ],
    headerMapping: {
      'GL Id': 'id',
      'Gl Code': 'glCode',
      'Gl Name': 'glName',
      'Debit Balance': 'debitBalance',
      'Credit Balance': 'creditBalance',
    },
  };

  schema = {
    selectedOfficer: Joi.number()
      .required()
      .error(() => {
        return { message: 'কর্মকর্তার নাম নির্বাচনকরুন' };
      }),
  };

  getConfig = () => {
    return localStorageData('config');
  };

  async getOfficers() {
    const token = localStorageData('token');
    const { officeId } = tokenData(token);
    const response = await axios.get(employeeRecord + officeId, this.getConfig());

    if (response.status == 200) {
      const officers = response.data.data;
      this.setState({ officers });
    }
  }

  async getProjects() {
    const projectResponse = await axios.get(loanProject, this.getConfig());
    if (projectResponse.status == 200) {
      const projects = projectResponse.data.data;
      this.setState({ projects });
    }
  }

  async postMigrationBalance() {
    const { data, selectedOfficer, selectedProject } = this.state;
    const payload = data.map((d) => d);
    const componentName = localStorageData('componentName');
    try {
      const res = await axios.post(
        balanceMigration + '/' + componentName,
        {
          data: payload,
          nextAppDesignationId: selectedOfficer,
          ...(selectedProject && { projectId: selectedProject }),
        },
        this.getConfig(),
      );
      if (res.status == 201) {
        NotificationManager.success('অনুমোদনের জন্য প্রেরণ করা হয়েছে', '', 3000);
        this.setState({
          selectedOfficer: '',
          selectedProject: '',
          data: [],
        });
      }
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 5000);
        });
      }
    }
  }

  async componentDidMount() {
    await this.getOfficers();
    await this.getProjects();
  }

  validate = () => {
    const keys = Object.keys(this.schema);
    const validateFields = {};
    const stateValues = { ...this.state };

    keys.map((k) => {
      validateFields[k] = stateValues[k];
    });

    const result = Joi.validate(validateFields, this.schema, {
      abortEarly: false,
    });

    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };

  validateIsBalanced = () => {
    let income = {
        debit: 0,
        credit: 0,
      },
      expense = {
        debit: 0,
        credit: 0,
      },
      liability = {
        debit: 0,
        credit: 0,
      },
      asset = {
        debit: 0,
        credit: 0,
      };

    this.state.data.map((d) => {
      const type = d.glCode.toString()[0];

      if (type == 1) {
        asset.debit += d.debitBalance || 0;
        asset.credit += d.creditBalance || 0;
      }
      if (type == 2) {
        liability.debit += d.debitBalance || 0;
        liability.credit += d.creditBalance || 0;
      }
      if (type == 3) {
        income.debit += d.debitBalance || 0;
        income.credit += d.creditBalance || 0;
      }
      if (type == 4) {
        expense.debit += d.debitBalance || 0;
        expense.credit += d.creditBalance || 0;
      }
    });

    return (
      income.credit + liability.credit - (income.debit + liability.debit) ==
      asset.debit + expense.debit - (asset.credit + expense.credit)
    );
  };

  processRowUpdate = (newState) => {
    let data = [...this.state.data];
    const oldDataIndex = data.findIndex((d) => d.id == newState.id);
    data[oldDataIndex] = newState;
    this.setState({ data });
    return newState;
  };

  handleProcessRowUpdateError = (error) => {
    error;
  };

  handleInputFIle = () => {};

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeFile = ({ target: { files } }) => {
    const file = files[0];

    this.setState({ file });
  };

  handleOfficerChange = async (e) => {
    const selectedOfficer = removeSelectedValue(e.target.value);

    ({ selectedOfficer });

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);

    if (errorMessage) {
      errors[e.target.name] = errorMessage;
    } else delete errors[e.target.name];

    this.setState({ selectedOfficer, errors });
  };

  handleProjectChange = async (e) => {
    const selectedProject = removeSelectedValue(e.target.value);

    this.setState({ selectedProject });
  };

  handleUploadBalance = async () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    if (!this.validateIsBalanced()) {
      NotificationManager.error('ডেবিট ও ক্রেডিটের পরিমাণ সমান নেই', '', 3000);
      return;
    }

    this.setState({ uploadButton: true });
    await this.postMigrationBalance();
    this.setState({ uploadButton: false });
  };

  handleClickUploadButton = () => {
    this.setState({ open: true });
  };

  handleExcelToJson = async () => {
    const { headerMapping } = this.state;
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.load(this.state.file);

    const dataWorksheet = workbook.getWorksheet(1);

    let dataArray = [];

    dataWorksheet.eachRow(function (row) {
      dataArray.push(row.values);
    });

    const [[, ...dataKeys], ...rest] = dataArray;

    const dataObj = rest.map(([, ...s]) => {
      return s.reduce(function (p, c, i) {
        p[headerMapping[dataKeys[i]]] = c;
        return p;
      }, {});
    });

    this.setState({
      data: dataObj.map((s) => {
        return {
          id: s.id,
          glCode: s.glCode,
          glName: s.glName,
          debitBalance: s.debitBalance,
          creditBalance: s.creditBalance,
        };
      }),
      open: false,
    });
  };

  renderButton = () => {
    return (
      <>
        <Button sx={{ mr: '5px' }} variant="outlined" onClick={this.handleClickUploadButton}>
          এক্সেল আপলোড
        </Button>
        <Button disabled={this.state.uploadButton} variant="outlined" onClick={this.handleUploadBalance}>
          সংরক্ষণ
        </Button>
      </>
    );
  };

  render() {
    const { selectedOfficer, errors, officers, selectedProject, projects } = this.state;

    return (
      <Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>{this.renderButton()}</Grid>
        <Divider sx={{ my: 2 }}></Divider>
        <Grid container sx={{ mb: 2 }} justifyContent="space-between" columnSpacing={{ sm: 2 }} rowSpacing={{ xs: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="selectedOfficer">
                {selectedOfficer == '' ? 'কর্মকর্তার নাম নির্বাচন করুন' : 'কর্মকর্তার নাম'}
              </InputLabel>
              <Select
                required
                name="selectedOfficer"
                id="selectedOfficer"
                value={selectedOfficer}
                label={selectedOfficer == '' ? 'কর্মকর্তার নাম নির্বাচন করুন' : 'কর্মকর্তার নাম'}
                size="small"
                onChange={this.handleOfficerChange}
                error={!!errors.selectedOfficer}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {officers.map(
                  (option) =>
                    option.designationId && (
                      <MenuItem value={option.designationId} key={option.designationId}>
                        {`${option.designation} - ${option.nameBn || ''}`}
                      </MenuItem>
                    ),
                )}
              </Select>
              <FormHelperText error={errors.selectedOfficer}>{errors.selectedOfficer}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="selectedProject">
                {selectedProject === '' ? 'প্রকল্পের নাম নির্বাচনকরুন' : 'প্রকল্পের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedProject"
                id="selectedProject"
                value={selectedProject}
                label={selectedProject === '' ? 'প্রকল্পের নাম নির্বাচনকরুন' : 'প্রকল্পের নাম'}
                onChange={this.handleProjectChange}
                size="small"
                error={!!errors.selectedProject}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {projects.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.projectNameBangla}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={errors.selectedProject}>{errors.selectedProject}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ mb: 0, pb: 0 }}
          >
            <DialogTitle id="alert-dialog-title">{'ইম্পোর্ট করার আগে করনীয় কাজ'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                এক্সেল ফাইলে নির্দিষ্ট ফরম্যাটে ডাটা দিন, অন্যথায় সঠিক ভাবে ইম্পোর্ট করতে পারবেন না।
              </DialogContentText>
              <Grid container spacing={2.5} justifyContent="flex-start">
                <Grid mt={1} item>
                  ফরম্যাট ডাউনলোড করুন
                </Grid>
                <Grid item>
                  <ExcelCreate />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }}></Divider>
              <Grid container>
                <Grid item>
                  <TextField
                    type="file"
                    name="আপলোড ফাইল"
                    inputProps={{ accept: '.xlsx, .xls' }}
                    onChange={this.handleChangeFile}
                  />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }}></Divider>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} variant="outlined">
                বাতিল করুন
              </Button>
              <Button disabled={!this.state.file} onClick={this.handleExcelToJson} variant="outlined">
                ইম্পোর্ট করুন
              </Button>
            </DialogActions>
          </Dialog>
          <BalanceTable data={this.state.data} />
        </Grid>
      </Grid>
    );
  }
}

export default UploadBalance;
