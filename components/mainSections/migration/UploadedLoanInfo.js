/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-14 12:32:17
 * @modify date 2023-07-17 11:13:21
 * @desc [description]
 */

import { AddBox, Delete, Edit, Group, GroupAdd } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
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
  Tooltip,
} from '@mui/material';
import { green, yellow } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import star from 'components/utils/coop/star';
import Joi from 'joi-browser';
import moment from 'moment';
import router from 'next/router';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData, removeSelectedValue, tokenData } from 'service/common';
import {
  approvedMigratedSamity,
  codeMaster,
  districtOffice,
  fieldOffRoute,
  loanProject,
  migratedSamityLoanInfo,
  samityMigration,
  upozilaOffice,
} from '../../../url/ApiList';

class UploadedLoanInfos extends Component {
  state = {
    samityList: [],
    upazilaOffices: [],
    districtOffices: [],
    projects: [],
    selectedProject: '',
    selectedOffice: '',
    selectedDistrictOffice: '',
    selectedUpazilaOffice: '',
    selectedSamity: '',
    deleteDialogOpen: false,
    deleteSamityId: null,
    applicationId: null,
    isRDAOrBARD: false,
    data: [],
    errors: {},

    columns: [
      {
        headerName: '#',
        filterable: false,
        width: 50,
        renderCell: (index) => {
          'index', index;

          return index.api.getRowIndex(index.row.customerOldCode) + 1;
        },
      },
      {
        headerName: 'সদস্যের কোড',
        field: 'customerOldCode',
        width: 150,
      },
      {
        headerName: 'সদস্যের নাম',
        field: 'memberNameBangla',
        width: 150,
      },
      {
        headerName: 'ঋণ বিতরণের তারিখ',
        width: 120,
        field: 'disbursementDate',
        valueFormatter: (params) => moment(params?.value).format('DD/MM/YYYY'),
      },
      {
        headerName: 'প্রোডাক্ট',
        field: 'productId',
        width: 140,
      },
      {
        headerName: 'ঋণের পরিমাণ',
        field: 'disbursementAmount',
        width: 130,
      },
      {
        headerName: 'কিস্তির সংখ্যা',
        field: 'noOfInstallment',
        width: 130,
      },
      {
        headerName: 'সার্ভিস চার্জ',
        field: 'totalServiceCharge',
        width: 130,
      },
      {
        headerName: 'পরিশোধিত মূলধন',
        field: 'paidPrincipalAmount',
        width: 120,
      },
      {
        headerName: 'পরিশোধিত সার্ভিস চার্জ',
        field: 'paidServiceChargeAmount',
        width: 140,
      },
      {
        headerName: 'পেনাল  চার্জ',
        field: 'penalCharge',
        width: 140,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'সম্পাদনা',
        width: 200,
        cellClassName: 'actions',
        getActions: ({ row }) => this.renderActionButton(row),
      },
    ],
    fieldOfficers: [],
    meetingDays: [],
    memberTypes: [
      {
        value: 'M',
        label: 'Male',
      },
      {
        value: 'F',
        label: 'Female',
      },
      {
        value: 'B',
        label: 'Both',
      },
    ],

    meetingTypes: [
      {
        value: 'W',
        label: 'Weekly',
      },
      {
        value: 'M',
        label: 'Monthly',
      },
    ],
    weekPositions: [
      {
        value: 1,
        label: '1st Week',
      },
      {
        value: 2,
        label: '2nd Week',
      },
      {
        value: 3,
        label: '3nd Week',
      },
      {
        value: 4,
        label: '4th Week',
      },
    ],
  };

  schema = {
    selectedProject: Joi.number()
      .required()
      .error(() => {
        return { message: 'প্রকল্পের নাম নির্বাচন করুন' };
      }),
    selectedDistrictOffice: Joi.number()
      .required()
      .error(() => {
        return { message: 'জেলা কার্যালয়ের নাম নির্বাচন করুন' };
      }),
    selectedUpazilaOffice: Joi.number()
      .required()
      .error(() => {
        return { message: 'উপজেলা কার্যালয়ের নাম নির্বাচন করুন' };
      }),
  };
  validate = () => {
    const schema = this.state.isRDAOrBARD ? { selectedProject: this.schema.selectedProject } : this.schema;

    const keys = Object.keys(schema);
    const validateFields = {};
    const stateValues = { ...this.state };

    keys.map((k) => {
      validateFields[k] = stateValues[k];
    });

    const result = Joi.validate(validateFields, schema, {
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

    ({ error, obj, schema });

    return error ? error.details[0].message : null;
  };

  autoSelectIfOneValue(arr, key) {
    const value = arr[0]?.id || null;
    if (arr?.length == 1) {
      this.setState({
        [key]: value,
      });
    }

    if (this.state.errors[key]) {
      delete this.state.errors[key];
    }
  }

  getConfig = () => {
    return localStorageData('config');
  };

  isRDAOrBARD = () => {
    const doptorId = tokenData()?.doptorId;

    const isRDAOrBARD = doptorId == 8 || doptorId == 4;

    this.setState({ isRDAOrBARD });
  };

  async getLoanInfoFromApplicationSamity(projectId, samityId) {
    try {
      const response = await axios.get(migratedSamityLoanInfo + samityId + '/' + projectId);

      if (response.status == 200) {
        if (response.data?.data?.loanInfo?.length > 0) {
          this.setState({
            data: response.data.data.loanInfo,
          });
        } else {
          this.setState({
            data: [],
          });
        }

        this.setState({
          applicationId: response.data.data.applicationId,
        });
      }
    } catch (error) {
      // NotificationManager.error(error.toString(), "", 5000);
    }
  }

  async getProjects() {
    const projectResponse = await axios.get(loanProject, this.getConfig());
    if (projectResponse.status == 200) {
      const projects = projectResponse.data.data;
      this.setState({ projects });

      this.autoSelectIfOneValue(projects, 'selectedProject');
      if (projects?.length === 1) {
        if (!this.state.isRDAOrBARD) {
          await this.getDistrictOffices();
        }

        await this.getSamity(projects[0]?.id);

        // this.state.selectedDistrictOffice &&
        //   (await this.getUpazilaOfficesByDistrict(this.state.selectedDistrictOffice));
      }
    } else {
      NotificationManager.error(projectResponse.errors[0].message, 5000);
    }
  }

  handleProjectChange = async (e) => {
    const selectedProject = removeSelectedValue(e.target.value);

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);

    if (errorMessage) {
      errors[e.target.name] = errorMessage;
    } else delete errors[e.target.name];

    this.setState({ selectedProject, errors });
    selectedProject && !this.state.isRDAOrBARD && (await this.getDistrictOffices());
    selectedProject && (await this.getSamity(selectedProject));

    this.state.selectedDistrictOffice && (await this.getUpazilaOfficesByDistrict(this.state.selectedDistrictOffice));
  };

  handleSamity = async (e) => {
    const { value } = e.target;
    this.setState({ selectedSamity: value });
    if (value && this.state.selectedProject) {
      await this.getLoanInfoFromApplicationSamity(this.state.selectedProject, value);
    }
  };

  resetUnionData = () => {
    const data = this.state.data.map((d) => {
      return { ...d, union: '' };
    });

    this.setState({ data });
  };

  async getDistrictOffices() {
    const districtResponse = await axios.get(districtOffice, this.getConfig());

    if (districtResponse.status == 200) {
      const districtOffices = districtResponse.data.data;
      this.setState({ districtOffices: districtOffices });
      //   ("districtOffices", this.state.districtOffices);
      this.autoSelectIfOneValue(districtOffices, 'selectedDistrictOffice');
      if (districtOffices?.length === 1) {
        await this.getUpazilaOfficesByDistrict(districtOffices[0]?.id);
      }
    } else {
      NotificationManager.error(districtResponse.errors[0].message, 5000);
    }
  }

  getSamity = async (project) => {
    if (project != '') {
      try {
        const token = localStorageData('token');
        const getTokenData = tokenData(token);
        let samity;
        if (getTokenData?.doptorId == 3) {
          samity = await axios.get(
            approvedMigratedSamity + '?isPagination=false&projectId=' + project + '&flag=1&withoutLoanApproved=true',
            this.getConfig(),
          );
        } else if (getTokenData?.doptorId == 10) {
          samity = await axios.get(
            approvedMigratedSamity + '?isPagination=false&projectId=' + project + '&flag=4',
            this.getConfig(),
          );
        } else {
          samity = await axios.get(
            approvedMigratedSamity + '?isPagination=false&projectId=' + project + '&flag=5&withoutLoanApproved=true',
            this.getConfig(),
          );
        }
        let samityData = samity.data.data;
        this.setState({ samityList: samityData });
      } catch (error) {
        if (error.response) {
          let message = error.response.data.errors[0].message;
          NotificationManager.error(message, '', 5000);
        } else if (error.request) {
          NotificationManager.error('Error Connecting...', '', 5000);
        } else if (error) {
          NotificationManager.error(error.toString(), '', 5000);
        }
      }
    } else {
      // NotificationManager.error("প্রজেক্ট নির্বাচনকরুন", "Warning", 5000);
    }
  };

  handleDistrictOfficeChange = async (e) => {
    const selectedDistrictOffice = removeSelectedValue(e.target.value);

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);

    if (errorMessage) {
      errors[e.target.name] = errorMessage;
    } else delete errors[e.target.name];

    this.setState({
      selectedDistrictOffice,
      errors,
    });

    selectedDistrictOffice && (await this.getUpazilaOfficesByDistrict(selectedDistrictOffice));

    selectedDistrictOffice || this.setState({ selectedUpazilaOffice: '', upazilaOffices: [] });
  };

  handleUpazilaOfficeChange = async (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);

    if (errorMessage) {
      errors[e.target.name] = errorMessage;
    } else delete errors[e.target.name];

    this.resetUnionData();
    'selectedUpazilaOfcfieId', e.target.value;
    // await this.getUnions(e.target.value);

    this.setState({
      selectedUpazilaOffice: removeSelectedValue(e.target.value),
      errors,
    });
  };

  async getUpazilaOfficesByDistrict(officeId) {
    const upazilaResponse = await axios.get(upozilaOffice + `?districtOfficeId=${officeId}`, this.getConfig());

    if (upazilaResponse.status == 200) {
      const upazilaOffices = upazilaResponse.data.data;
      this.setState({ upazilaOffices });
      this.autoSelectIfOneValue(upazilaOffices, 'selectedUpazilaOffice');
    } else {
      NotificationManager.error(upazilaResponse.errors[0].message, 5000);
    }
  }

  async getFieldOfficers() {
    const fieldOfficerResponse = await axios.get(fieldOffRoute, this.getConfig());
    if (fieldOfficerResponse.status == 200) {
      const fieldOfficers = fieldOfficerResponse.data.data;
      this.setState({ fieldOfficers });
    } else {
      NotificationManager.error(fieldOfficerResponse.errors[0].message, 5000);
    }
  }

  async getMeetingDays() {
    const response = await axios.get(codeMaster + '?codeType=MET', this.getConfig());
    if (response.status == 200) {
      const meetingDays = response.data.data;
      this.setState({ meetingDays });
    } else {
      // try case use korte hobe
      // NotificationManager.error(projectResponse.errors[0].message, 5000);
    }
  }

  async deleteSamity() {
    if (this.state.deleteSamityId) {
      try {
        const res = await axios.delete(samityMigration + '/' + this.state.deleteSamityId, this.getConfig());
        if (res.status == 200) {
          NotificationManager.success('সমিতি ডিলিট হয়েছে', '', 5000);

          return true;
        }
      } catch (error) {
        if (error.response.status == 400) {
          error.response.data.errors.map((r) => {
            NotificationManager.error(r.message, '', 5000);
          });
        }

        return false;
      }
    }

    return false;
  }

  async componentDidMount() {
    await this.getFieldOfficers();
    await this.getMeetingDays();
    // await this.getMigratedSamity();
    await this.getProjects();
    this.isRDAOrBARD();
  }

  getChipProps = (params) => {
    if (params.value === 0) {
      return {
        icon: <WarningIcon style={{ fill: yellow[800] }} />,
        label: params.value,
        style: {
          borderColor: yellow[800],
        },
      };
    } else {
      return {
        icon: <CheckCircleIcon style={{ fill: green[500] }} />,
        label: params.value,
        style: {
          borderColor: green[500],
        },
      };
    }
  };

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false, deleteSamityId: null });
  };

  handleSamityDelete = (id) => {
    this.setState({ deleteDialogOpen: true, deleteSamityId: id });
  };

  handleConfirmDelete = async () => {
    const result = await this.deleteSamity();
    if (result) {
      const data = this.state.data.filter((d) => d.id != this.state.deleteSamityId);
      this.setState({ data, deleteSamityId: null, deleteDialogOpen: false });
    }
  };

  renderActionButton = (row) => {
    return this.props.mode == 'approval'
      ? [
          <>
            <Button
              size="small"
              variant="outlined"
              onClick={() => router.push(`/samity-management/manual-samity-approval/details/${row.id}`)}
            >
              বিস্তারিত
            </Button>
          </>,
        ]
      : [
          <Grid container mx={2} key={row.id}>
            {this.props.mode == 'loanInfoMigration' ? (
              <Tooltip placement="top-start" title="ঋণের তথ্য হালদানাগাদ">
                <Edit
                  // style={{
                  //   height: "24px",
                  //   width: "24px",
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  // }}
                  onClick={() => {
                    router.push(
                      `loan/loanInfoUpload/${this.state.selectedSamity}?applicationId=${this.state.applicationId}&customerOldCode=${row.customerOldCode}`,
                    );
                  }}
                >
                  <img src="/loanIcon.png" style={{ maxWidth: '80%' }}></img>
                </Edit>
              </Tooltip>
            ) : (
              <>
                <Tooltip placement="top-start" title="">
                  <Edit
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/migration/editSamity/${row.id}`)}
                    color="action"
                  ></Edit>
                </Tooltip>
                <Tooltip placement="top-start" title="সদস্য আপলোড">
                  <GroupAdd
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/migration/uploadMember/${row.id}`)}
                    color="success"
                  ></GroupAdd>
                </Tooltip>
                <Tooltip placement="top-start" title="সদস্য হালনাগাদ">
                  <Group
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/migration/members/list/${row.id}`)}
                    color="secondary"
                  ></Group>
                </Tooltip>
                <Tooltip placement="top-start" title="সমিতি বাতিল">
                  <Delete
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleSamityDelete(row.id)}
                    color="error"
                  ></Delete>
                </Tooltip>
              </>
            )}
          </Grid>,
        ];
  };
  renderButton = () => {
    return this.state.selectedSamity && this.state.selectedProject && this.state.data.length == 0 ? (
      //   &&
      //   this.state.data.length == 0

      <>
        <Button
          sx={{ mr: '5px' }}
          variant="outlined"
          onClick={() => {
            router.push(`/migration/loan/loanInfoUpload/${this.state.selectedSamity}`);
          }}
        >
          এক্সেল আপলোড পেইজ এ প্রবেশ করুন
        </Button>
      </>
    ) : (
      ''
    );
  };

  renderDeleteConfirmation = () => {
    return (
      <Grid>
        <Dialog
          open={this.state.deleteDialogOpen}
          onClose={this.handleDeleteDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ mb: 0, pb: 0 }}
        >
          <DialogTitle id="alert-dialog-title">{'বাতিল করুন'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">আপনি নিশ্চিত এই সমিতি বাতিল করতে চান?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteDialogClose} variant="outlined">
              বাতিল করুন
            </Button>
            <Button variant="outlined" onClick={this.handleConfirmDelete}>
              বাতিল করুন
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  };

  render() {
    return (
      <Grid sx={{ cursor: 'pointer' }}>
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>{this.renderButton()}</Grid>
        {this.props.mode != 'loanInfoMigration' && (
          <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AddBox
              fontSize="large"
              sx={{ mr: 2, cursor: 'pointer' }}
              onClick={() => router.push('/migration/uploadSamity')}
            />
          </Grid>
        )}

        <Divider sx={{ my: 2 }}></Divider>
        <Grid container sx={{ mb: 2 }} justifyContent="space-between" columnSpacing={{ sm: 2 }} rowSpacing={{ xs: 2 }}>
          <Grid item xs={12} sm={this.state.isRDAOrBARD ? 6 : 4}>
            <FormControl fullWidth>
              <InputLabel id="selectedProject">
                {this.state.selectedProject === '' ? star('প্রকল্পের নাম নির্বাচন করুন') : 'প্রকল্পের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedProject"
                id="selectedProject"
                value={this.state.selectedProject}
                label={this.selectedProject === '' ? star('প্রকল্পের নাম নির্বাচন করুন') : 'প্রকল্পের নাম'}
                onChange={this.handleProjectChange}
                size="small"
                error={!!this.state.errors.selectedProject}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {this.state.projects.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.projectNameBangla}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={this.state.errors.selectedProject}>
                {this.state.errors.selectedProject}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} hidden={this.state.isRDAOrBARD}>
            <FormControl fullWidth>
              <InputLabel id="selectedDistrictOffice">
                {this.state.selectedDistrictOffice === ''
                  ? star('জেলা কার্যালয়ের নাম নির্বাচন করুন')
                  : 'জেলা কার্যালয়ের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedDistrictOffice"
                id="selectedDistrictOffice"
                value={this.state.selectedDistrictOffice}
                label={
                  this.state.selectedDistrictOffice === ''
                    ? star('জেলা কার্যালয়ের নাম নির্বাচন করুন')
                    : 'জেলা কার্যালয়ের নাম'
                }
                onChange={this.handleDistrictOfficeChange}
                disabled={this.state.districtOffices?.length == 1}
                size="small"
                error={!!this.state.errors.selectedDistrictOffice}
                helperText={this.state.errors.selectedDistrictOffice}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {this.state.districtOffices.map((option) => {
                  return (
                    <MenuItem value={option.id} key={option.id}>
                      {option.officeNameBangla}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText error={this.state.errors.selectedDistrictOffice}>
                {this.state.errors.selectedDistrictOffice}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} hidden={this.state.isRDAOrBARD}>
            <FormControl fullWidth>
              <InputLabel id="selectedUpazilaOffice">
                {this.state.selectedUpazilaOffice === ''
                  ? star('উপজেলা কার্যালয়ের নাম নির্বাচন করুন')
                  : 'উপজেলা কার্যালয়ের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedUpazilaOffice"
                id="selectedUpazilaOffice"
                value={this.state.selectedUpazilaOffice}
                label={
                  this.state.selectedUpazilaOffice === ''
                    ? star('উপজেলা কার্যালয়ের নাম নির্বাচন করুন')
                    : 'উপজেলা কার্যালয়ের নাম'
                }
                onChange={this.handleUpazilaOfficeChange}
                disabled={this.state.upazilaOffices?.length == 1}
                size="small"
                error={!!this.state.errors.selectedUpazilaOffice}
                helperText={this.state.errors.selectedUpazilaOffice}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {this.state.upazilaOffices.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.officeNameBangla}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={this.state.errors.selectedUpazilaOffice}>
                {this.state.errors.selectedUpazilaOffice}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={this.state.isRDAOrBARD ? 6 : 12}>
            <FormControl fullWidth>
              <InputLabel id="selectedSamity">
                {this.state.selectedSamity == '' ? star('সমিতি নির্বাচন করুন') : 'সমিতির নাম'}
              </InputLabel>
              <Select
                required
                name="selectedSamity"
                id="selectedSamity"
                value={this.state.selectedSamity}
                onChange={this.handleSamity}
                label={this.state.selectedSamity == '' ? star('সমিতি নির্বাচন করুন') : 'সমিতির নাম'}
                size="small"
              >
                {this.state.samityList.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.samityName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {this.renderDeleteConfirmation()}

        <Grid sx={{ width: '100%' }}>
          <DataGrid
            rows={this.state.data}
            columns={this.state.columns}
            getRowId={(row) => row.customerOldCode}
            density="compact"
            disableColumnFilter={true}
            disableColumnMenu={true}
            disableColumnSelector={true}
            disableDensitySelector={true}
            disableExtendRowFullWidth={true}
            disableIgnoreModificationsIfProcessingProps={true}
            disableSelectionOnClick={true}
            disableVirtualization={true}
            autoHeight={true}
            
          />
        </Grid>
      </Grid>
    );
  }
}

export default UploadedLoanInfos;
