/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/**
 * @author Md Raju Ahmed
 * @email rajucse1705@gmail.com
 * @create date 2022-11-14 12:32:17
 * @modify date 2022-11-14 12:32:17
 * @desc [description]
 */

import { AddBox, Delete, Edit, Group, GroupAdd } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Tooltip,
} from '@mui/material';
import { green, yellow } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import router from 'next/router';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { localStorageData } from 'service/common';
import { engToBang } from 'service/numberConverter';
import { codeMaster, fieldOffRoute, samityMigration } from '../../../url/ApiList';

class SamityList extends Component {
  state = {
    deleteDialogOpen: false,
    deleteSamityId: null,
    data: [],

    columns: [
      {
        headerName: '#',
        filterable: false,
        width: 50,
        renderCell: (index) => engToBang(index.api.getRowIndex(index.row.id) + 1),
      },
      {
        headerName: 'পুরাতন কোড',
        field: 'samityOldCode',
        width: 150,
      },
      {
        headerName: 'নাম',
        field: 'samityName',
        width: 150,
      },
      {
        headerName: 'সর্বমোট সদস্য',
        width: 120,
        field: 'totalMembers',
        align: 'center',
        valueGetter: (params) => params.row?.members?.length,
        renderCell: (params) => {
          return <Chip variant="outlined" size="small" {...this.getChipProps(params)} />;
        },
      },
      {
        headerName: 'গঠনের তারিখ',
        field: 'formationDate',
        width: 140,
        valueFormatter: (params) => moment(params?.value, 'DD/MM/YYYY').format('DD/MM/YYYY'),
      },
      {
        headerName: 'সদস্যের ধরণ',
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
        headerName: ' বৈঠকের ধরণ',
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
        headerName: 'সপ্তাহের অবস্থান',
        field: 'weekPosition',
        width: 130,
        valueFormatter: (params) => {
          if (params.value) {
            const position = this.state.weekPositions.find((m) => m.value == params.value);
            return position ? position.label : '';
          }
        },
      },
      {
        headerName: 'বৈঠকের দিন',
        field: 'meetingDay',
        width: 120,
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.meetingDays.find((f) => f.id == params.value);
            return data ? data.displayValue : params.value;
          }
        },
      },
      {
        headerName: 'ঠিকানা',
        field: 'address',
        width: 140,
      },
      {
        headerName: 'মাঠকর্মী',
        field: 'foUserId',
        width: 140,
        valueFormatter: (params) => {
          if (params.value && this.state.fieldOfficers?.length > 0) {
            const fieldOfficer = this.state.fieldOfficers.find((f) => f.id == params.value);
            return fieldOfficer ? fieldOfficer?.nameBn : '';
          }
        },
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
        value: 2,
        label: 'পুরুষ',
      },
      {
        value: 3,
        label: 'মহিলা',
      },
      {
        value: 4,
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
    pageSize: 8,
  };

  getConfig = () => {
    return localStorageData('config');
  };

  async getMigratedSamity() {
    const response =
      this.props.mode == 'loanInfoMigration'
        ? await axios.get(samityMigration + '?approveStatus=A', this.getConfig())
        : await axios.get(samityMigration, this.getConfig());
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

  async getMeetingDays() {
    const response = await axios.get(codeMaster + '?codeType=MET', this.getConfig());
    if (response.status == 200) {
      const meetingDays = response.data.data;
      this.setState({ meetingDays });
    } else {
      NotificationManager.error('মিটিং এর দিন পাওয়া যায়নি', 5000);
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
    await this.getMigratedSamity();
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
              <Tooltip placement="top-start" title="ঋণের তথ্য আপলোড">
                <div
                  style={{
                    height: '24px',
                    width: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={() => {
                    router.push(`loan/loanInfoUpload/${row.id}`);
                  }}
                >
                  <img src="/loanIcon.png" style={{ maxWidth: '80%' }}></img>
                </div>
              </Tooltip>
            ) : (
              <>
                <Tooltip placement="top-start" title="সমিতি হালনাগাদ">
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
          <DialogTitle id="alert-dialog-title">{'ডিলিট করুন'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">আপনি নিশ্চিত এই সমিতি ডিলিট করতে চান?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteDialogClose} variant="outlined">
              বাতিল করুন
            </Button>
            <Button variant="outlined" onClick={this.handleConfirmDelete}>
              ডিলিট করুন
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  };

  render() {
    return (
      <Grid sx={{ cursor: 'pointer' }}>
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
        {this.renderDeleteConfirmation()}
        <Grid sx={{ width: '100%' }}>
          <DataGrid
            rows={this.state.data}
            columns={this.state.columns}
            getRowId={(row) => row.id}
            density="compact"
            // disableColumnFilter={true}
            // disableColumnMenu={true}
            // disableColumnSelector={true}
            // disableDensitySelector={true}
            // disableExtendRowFullWidth={true}
            // disableIgnoreModificationsIfProcessingProps={true}
            // disableSelectionOnClick={true}
            // disableVirtualization={true}
            autoHeight={true}
            pageSize={this.state?.pageSize}
            rowsPerPageOptions={[8, 20, 50, 100]}
            onPageSizeChange={(newPageSize) => {
              this.setState({ pageSize: newPageSize });
            }}
          />
        </Grid>
      </Grid>
    );
  }
}

export default SamityList;
