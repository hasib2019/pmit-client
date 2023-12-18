/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-14 12:32:17
 * @modify date 2022-11-14 12:32:17
 * @desc [description]
 */

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { Button, Divider, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { green, yellow } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { uniq, uniqBy } from 'lodash';
import moment from 'moment';
import router from 'next/router';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { fieldOffRoute, getUnionByUpazilaId, loanProject, samityMigration } from '../../../../url/ApiList';
import { engToBang } from '../../../mainSections/samity-managment/member-registration/validator';
class SamityList extends Component {
  state = {
    deleteDialogOpen: false,
    deleteSamityId: null,
    data: [],
    projects: [],
    selectedProject: '',
    columns: [
      {
        headerName: '#',
        filterable: false,
        width: 50,
        renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
      },
      {
        headerName: 'সমিতির কোড',
        field: 'samityOldCode',
        width: 150,
        valueGetter: (params) => engToBang(params?.value),
      },
      {
        headerName: 'সমিতির নাম',
        field: 'samityName',
        width: 150,
      },
      {
        headerName: 'গঠনের তারিখ',
        field: 'formationDate',
        width: 140,

        valueFormatter: (params) => engToBang(moment(params?.value, 'DD/MM/YYYY').format('DD/MM/YYYY')),
      },
      {
        headerName: 'সদস্যের ধরন',
        field: 'samityMemberType',
        width: 130,
        valueFormatter: (params) => {
          if (params.value) {
            const type = this.state.memberTypes.find((m) => m.value == params.value);
            return type ? type.label : '';
          }
        },
      },
      {
        headerName: 'মিটিং এর ধরন',
        field: 'meetingType',
        width: 130,
        valueFormatter: (params) => {
          if (params.value) {
            const type = this.state.meetingTypes.find((m) => m.value == params.value);
            return type ? type.label : '';
          }
        },
      },
      {
        headerName: 'ইউনিয়ন',
        field: 'union',
        width: 120,
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.unions.find((f) => f.uniThanaPawId == params.value);
            return data?.uniThanaPawNameBangla || params.value;
          }
        },
      },
      {
        headerName: 'বিস্তারিত ঠিকানা',
        field: 'address',
        width: 140,
      },
      {
        headerName: 'মাঠ কর্মী',
        field: 'foUserId',
        width: 120,
        valueFormatter: (params) => {
          if (params.value) {
            const { nameBn } = this.state.fieldOfficers.find((f) => f.id == params.value);
            return nameBn;
          }
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'বিস্তারিত',
        width: 120,
        cellClassName: 'actions',
        getActions: ({ row }) => this.renderActionButton(row),
      },
    ],
    fieldOfficers: [],
    unions: [],
    memberTypes: [
      {
        value: '2',
        label: 'পুরুষ',
      },
      {
        value: '3',
        label: 'মহিলা',
      },
      {
        value: '4',
        label: 'অন্যান্য',
      },
    ],

    meetingTypes: [
      {
        value: 'W',
        label: 'সাপ্তাহিক',
      },
      {
        value: 'M',
        label: 'মাসিক',
      },
    ],
    weekPositions: [
      {
        value: 1,
        label: 'প্রথম সপ্তাহ',
      },
      {
        value: 2,
        label: 'দ্বিতীয় সপ্তাহ',
      },
      {
        value: 3,
        label: 'তৃতীয় সপ্তাহ',
      },
      {
        value: 4,
        label: 'চতুর্থ সপ্তাহ',
      },
    ],
  };

  getConfig = () => {
    return localStorageData('config');
  };

  async getMigratedSamity() {
    const response = await axios.get(samityMigration + '?approveStatus=P', this.getConfig());
    if (response.status == 200) {
      const samity = response.data.data;
      this.setState({
        data: samity.map((s) => {
          return { ...s.data, id: s.id };
        }),
      });
    } else {
      NotificationManager.error(response.errors[0].message, 5000);
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

  async getProjects() {
    const projectResponse = await axios.get(loanProject, this.getConfig());
    if (projectResponse.status == 200) {
      const projects = projectResponse.data.data;
      this.setState({ projects });
    } else {
      NotificationManager.error(projectResponse.errors[0].message, 5000);
    }
  }

  async getUnions() {
    const upazilaIds = uniq(
      this.state.data.map((d) => {
        ({ d });
        return d.upazilaId;
      }),
    );
    ({ upazilaIds });
    if (upazilaIds.length) {
      upazilaIds.map(async (u) => {
        const response = await axios.get(getUnionByUpazilaId + `&upazila=${u}`, this.getConfig());
        if (response.status == 200) {
          const unions = response.data.data;
          this.setState({
            unions: uniqBy([...this.state.unions, ...unions], 'uniThanaPawId'),
          });
        } else {
          NotificationManager.error(response.errors[0].message, 5000);
        }
      });
    }
  }

  async componentDidMount() {
    await this.getProjects();
    await this.getFieldOfficers();
    await this.getMigratedSamity();
    await this.getUnions();
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

  handleProjectChange = async (e) => {
    await this.getMigratedSamity();
    const data = this.state.data;
    const { value } = e.target;

    const filteredData = data.filter((d) => d.projectId == value);

    this.setState({ selectedProject: value, data: filteredData });
  };

  renderActionButton = (row) => {
    return [
      <>
        <Button
          size="small"
          variant="outlined"
          onClick={() => router.push(`/samity-management/manual-samity-approval/details/${row.id}`)}
        >
          বিস্তারিত
        </Button>
      </>,
    ];
  };

  render() {
    return (
      <Grid>
        <Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="selectedProject">
                {this.state.selectedProject === '' ? 'প্রোজেক্ট অনুযায়ী ফিল্টার করুন' : 'প্রোজেক্টের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedProject"
                id="selectedProject"
                value={this.state.selectedProject}
                label={this.state.selectedProject === '' ? 'প্রোজেক্ট অনুযায়ী ফিল্টার করুন' : 'প্রোজেক্টের নাম'}
                onChange={this.handleProjectChange}
                size="small"
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
            </FormControl>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }}></Divider>
        <Grid sx={{ width: '100%' }}>
          <DataGrid
            rows={this.state.data}
            columns={this.state.columns}
            getRowId={(row) => row.id}
            density="compact"
            // disableColumnFilter={false}
            // disableColumnMenu={true}
            // disableColumnSelector={true}
            // disableDensitySelector={true}
            // disableExtendRowFullWidth={true}
            // disableIgnoreModificationsIfProcessingProps={true}
            // disableSelectionOnClick={true}
            // disableVirtualization={true}
            autoHeight={true}
          />
        </Grid>
      </Grid>
    );
  }
}

export default SamityList;
