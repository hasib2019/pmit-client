/* eslint-disable react/no-direct-mutation-state */
import { Close } from '@mui/icons-material';
import {
  Autocomplete,
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
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Exceljs from 'exceljs';
import Joi from 'joi-browser';
import { get, reject } from 'lodash';
import moment from 'moment';
import router from 'next/router';

import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { isRichValue, localStorageData, removeSelectedValue, richToString, tokenData } from 'service/common';
import { engToBang } from 'service/numberConverter';
import {
  codeMaster,
  District as allDistricts,
  districtOffice,
  fieldOffRoute,
  getUnionByUpazilaId,
  loanProject,
  samityMigration,
  Upazila as upazilaByDistrictId,
  upozilaOffice,
} from '../../../url/ApiList';
import star from '../loan-management/loan-application/utils';

class UploadSamity extends Component {
  state = {
    editable: true,
    open: false,
    uploadButton: false,
    file: null,
    projects: [],
    districtOffices: [],
    upazilaOffices: [],
    fieldOfficers: [],
    meetingDays: [],
    districts: [],
    upazila: {},
    unions: [],
    selectedProject: '',
    selectedDistrictOffice: '',
    selectedUpazilaOffice: '',
    isRDAOrBARD: false,
    pageSize: 8,
    data: [],
    errors: {},
    editingRow: { current: null },
    kishoriColumn: [
      {
        headerName: '#',

        filterable: false,
        width: 50,
        renderCell: (index) => engToBang(index.api.getRowIndex(index.row.samityOldCode) + 1),
      },
      {
        headerName: 'পুরাতন কোড',
        field: 'samityOldCode',
        width: 150,
        editable: false,
        type: 'string',
        valueGetter: (params) => {
          return engToBang(params.row.samityOldCode);
        },
      },
      {
        headerName: 'নাম',
        field: 'samityName',
        width: 150,
        editable: true,
        type: 'string',
        preProcessEditCellProps(params) {
          ({ params });
          const invalid = false;
          return { ...params.props, error: invalid };
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            samityName: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'গঠনের তারিখ',
        field: 'formationDate',
        width: 140,
        editable: true,
        type: 'date',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          let newDate;
          let formatedDateWithNewDate;
          if (this.props?.samityId) {
            newDate = new Date(value);
            formatedDateWithNewDate = moment(newDate).format('DD/MM/YYYY');
          }
          data[foundIndex] = {
            ...data[foundIndex],
            formationDate: this.props?.samityId ? formatedDateWithNewDate : value,
          };
          this.setState({ data: data });
          return this.props?.samityId ? formatedDateWithNewDate : value;
        },
        valueFormatter: (params) => {
          const formatedDate = this.props?.samityId ? params?.value : moment(params?.value).format('DD/MM/YYYY');

          return engToBang(formatedDate);
        },
        // engToBang(moment(params?.value, "DD/MM/YYYY").format("DD/MM/YYYY")),
        // valueGetter: this.props.samityId
        //   ? (params) => {
        //       const englishFormattedDate = moment(params?.value).format(
        //         "DD/MM/YYYY"
        //       );
        //       return englishFormattedDate;
        //     }
        //   : (params) => {
        //       const englishFormattedDate = moment(params?.value).format(
        //         "DD/MM/YYYY"
        //       );
        //       return englishFormattedDate;
        //     },
      },
      {
        headerName: 'সদস্যের ধরণ',
        field: 'samityMemberType',
        width: 130,
        type: 'singleSelect',
        editable: true,
        valueOptions: () => this.state.memberTypes,
        valueFormatter: (params) => {
          if (params.value) {
            const { label } = this.state.memberTypes.find((m) => m.value == params.value);
            return label;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], samityMemberType: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বৈঠকের ধরণ',
        field: 'meetingType',
        width: 130,
        type: 'singleSelect',
        editable: true,
        valueOptions: () => this.state.meetingTypes,
        valueFormatter: (params) => {
          if (params.value) {
            const { label } = this.state.meetingTypes.find((m) => m.value == params.value);
            return label;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], meetingType: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'সপ্তাহের অবস্থান',
        field: 'weekPosition',
        width: 130,
        type: 'singleSelect',
        editable: true,
        cellClassName: (params) => {
          if (!params.value && params.row.meetingType === 'M') return 'warning';

          return '';
        },
        valueOptions: () => this.state.weekPositions,
        valueFormatter: (params) => {
          if (params.value) {
            const { label } = this.state.weekPositions.find((m) => m.value == params.value);
            return label;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], weekPosition: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বৈঠকের দিন',
        field: 'meetingDay',
        width: 130,
        type: 'singleSelect',
        editable: true,
        valueOptions: () => {
          return this.state.meetingDays.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.meetingDays.find((f) => f.id == params.value);
            return data ? data.displayValue : params.value;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], meetingDay: value };
          this.setState({ data: data });
          return value;
        },
      },
      // {
      //   headerName: "জেলা",
      //   field: "districtId",
      //   width: 240,
      //   editable: true,
      //   cellClassName: (params) => {
      //     if (!params.value) return "warning";

      //     return "";
      //   },

      //   renderEditCell: (params) => {
      //     const index = this.state.data.findIndex(
      //       (row) => row.samityOldCode === params.row.samityOldCode
      //     );

      //     return (
      //       <Autocomplete
      //         fullWidth
      //         name="districtId"
      //         options={this.state.districts}
      //         getOptionLabel={(option) => option?.districtNameBangla}
      //         value={
      //           this.state.districts?.find(
      //             (dis) => dis?.id == this.state?.data[index]?.districtId
      //           ) || undefined
      //         }
      //         onChange={(e, value) => {
      //           if (value) {
      //             const data = [...this.state.data];
      //             const foundIndex = data?.findIndex(
      //               (obj) => +obj.samityOldCode === +params.row.samityOldCode
      //             );
      //             data[foundIndex] = {
      //               ...data[foundIndex],
      //               districtId: value?.id,
      //             };

      //             this.getUpazila(value?.id);
      //             this.setState({ data: data });
      //           }
      //         }}
      //         renderInput={(params) => <TextField {...params} />}
      //       />
      //     );
      //   },
      // },

      // {
      //   headerName: "উপজেলা",
      //   field: "upazilaId",
      //   width: 240,

      //   editable: true,
      //   cellClassName: (params) => {
      //     if (!params.value) return "warning";

      //     return "";
      //   },
      //   renderEditCell: (params) => {
      //     const index = this.state.data.findIndex(
      //       (row) => row.samityOldCode === params.row.samityOldCode
      //     );
      //     return (
      //       <Autocomplete
      //         fullWidth
      //         name="upazilaId"
      //         disableClearable={true}
      //         options={
      //           this.state.upazila[this.state.data[index]?.districtId]?.length >
      //           0
      //             ? this.state.upazila[this.state.data[index]?.districtId]
      //             : []
      //         }
      //         getOptionLabel={(option) => option?.upaCityNameBangla}
      //         value={
      //           this.state.upazila[params?.row?.districtId]?.find(
      //             (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId
      //           ) || undefined
      //         }
      //         onChange={(event, value) => {
      //           const data = [...this.state.data];
      //           const foundIndex = data?.findIndex(
      //             (obj) => +obj.samityOldCode === +params.row.samityOldCode
      //           );
      //           data[foundIndex] = {
      //             ...data[foundIndex],
      //             upazilaId: value?.upaCityId,
      //           };
      //           this.getUnions(value?.upaCityId);
      //           this.setState({ data: data });
      //         }}
      //         renderInput={(params) => <TextField {...params} />}
      //       />
      //     );
      //   },
      // },
      {
        headerName: 'ইউনিয়ন',
        field: 'union',
        width: 240,
        // type: "singleSelect",
        editable: true,
        cellClassName: (params) => {
          if (!params.value) return 'warning';
          return '';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);

          return (
            <Autocomplete
              fullWidth
              name="union"
              variant="standard"
              disableClearable={true}
              options={
                this.state.isRDAOrBARD
                  ? this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                    ? this.state.unions[this.state.data[index]?.upazilaId]
                    : []
                  : this.state.unions?.length > 0
                  ? this.state.unions
                  : []
                // this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                //   ?
                //   : []
              }
              getOptionLabel={(option) => option?.uniThanaPawNameBangla}
              value={
                //   this.state.unions?.find(
                //   (upa) => upa?.uniThanaPawId === this.state?.data[index]?.union
                // )

                this.state.unions[params?.row?.upazilaId]?.find(
                  (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId,
                ) || undefined
              }
              onChange={(e, value) => {
                const data = [...this.state.data];
                const foundIndex = data?.findIndex((obj) => obj.samityOldCode == params.row.samityOldCode);

                data[foundIndex] = {
                  ...data[foundIndex],
                  union: value?.uniThanaPawId,
                };
                this.setState({ data: data });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);

          return (
            <Autocomplete
              fullWidth
              name="union"
              variant="standard"
              disableClearable={true}
              options={
                this.state.isRDAOrBARD
                  ? this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                    ? this.state.unions[this.state.data[index]?.upazilaId]
                    : []
                  : this.state.unions?.length > 0
                  ? this.state.unions
                  : []
                // this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                //   ?
                //   : []
              }
              getOptionLabel={(option) => option?.uniThanaPawNameBangla}
              value={
                //   this.state.unions?.find(
                //   (upa) => upa?.uniThanaPawId === this.state?.data[index]?.union
                // )

                this.state.unions[params?.row?.upazilaId]?.find(
                  (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId,
                ) || undefined
              }
              onChange={(e, value) => {
                const data = [...this.state.data];
                const foundIndex = data?.findIndex((obj) => obj.samityOldCode == params.row.samityOldCode);

                data[foundIndex] = {
                  ...data[foundIndex],
                  union: value?.uniThanaPawId,
                };
                this.setState({ data: data });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          );
        },
        // valueOptions: () => {
        //   return this.state.unions.map((f) => {
        //     return {
        //       label: f.uniThanaPawNameBangla,
        //       value: f.uniThanaPawId,
        //     };
        //   });
        // },
        // valueFormatter: (params) => {
        //   if (params.value) {
        //     const data = this.state.unions.find(
        //       (f) => f.uniThanaPawId == params.value
        //     );
        //     return data?.uniThanaPawNameBangla || params.value;
        //   }
        // },
        // valueParser: (value, params) => {
        //   const data = [...this.state.data];
        //   const foundIndex = data?.findIndex(
        //     (obj) => +obj.samityOldCode === +params.row.samityOldCode
        //   );
        //   data[foundIndex] = { ...data[foundIndex], union: value };
        //   this.setState({ data: data });
        //   return value;
        // },
      },
      {
        headerName: 'ঠিকানা',
        field: 'address',
        width: 140,
        type: 'string',
        editable: true,
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], address: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'মাঠকর্মী',
        field: 'foUserId',
        width: 140,
        type: 'singleSelect',
        editable: true,
        cellClassName: (params) => {
          if (!params.value) return 'warning';
          return '';
        },
        valueOptions: () => {
          return this.state.fieldOfficers.map((f) => {
            return {
              label: f.nameBn,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const { nameBn } = this.state.fieldOfficers.find((f) => f.id == params.value);

            return nameBn;
          }
        },
        valueParser: (value, params) => {
          console.log('foValue', value);
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => obj.samityOldCode == params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], foUserId: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বিদ্যালয়ের নাম',
        field: 'schoolName',
        width: 150,
        editable: false,
        type: 'string',
      },

      {
        headerName: 'বিদ্যালয়ের কোড',
        field: 'schoolCode',
        width: 150,
        editable: false,
        type: 'string',
      },
      {
        headerName: 'বিদ্যালয়ের ঠিকানা',
        field: 'schoolAddress',
        width: 150,
        editable: false,
        type: 'string',
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'বাতিল',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ row }) => {
          return [
            <Button
              key={row.samityOldCode}
              variant="outlined"
              color="error"
              onClick={() => this.handleDeleteClick(row.samityOldCode)}
              size="small"
            >
              <Close></Close>
            </Button>,
          ];
        },
      },
    ],
    columns: [
      {
        headerName: '#',
        filterable: false,

        width: 50,
        renderCell: (index) => engToBang(index.api.getRowIndex(index.row.samityOldCode) + 1),
      },
      {
        headerName: 'পুরাতন কোড',
        field: 'samityOldCode',
        width: 150,
        editable: false,
        type: 'string',
        valueGetter: (params) => {
          return engToBang(params.row.samityOldCode);
        },
      },
      {
        headerName: 'নাম',
        field: 'samityName',
        width: 150,
        editable: true,
        type: 'string',
        preProcessEditCellProps(params) {
          ({ params });
          const invalid = false;
          return { ...params.props, error: invalid };
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = {
            ...data[foundIndex],
            samityName: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'গঠনের তারিখ',
        field: 'formationDate',
        width: 140,
        editable: true,
        type: 'date',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          let newDate;
          let formatedDateWithNewDate;
          if (this.props?.samityId) {
            newDate = new Date(value);
            formatedDateWithNewDate = moment(newDate).format('DD/MM/YYYY');
          }
          data[foundIndex] = {
            ...data[foundIndex],
            formationDate: this.props?.samityId ? formatedDateWithNewDate : value,
          };
          this.setState({ data: data });
          return this.props?.samityId ? formatedDateWithNewDate : value;
        },
        valueFormatter: (params) => {
          const formatedDate = this.props?.samityId ? params?.value : moment(params?.value).format('DD/MM/YYYY');

          return engToBang(formatedDate);
        },
        // engToBang(moment(params?.value, "DD/MM/YYYY").format("DD/MM/YYYY")),
        // valueGetter: this.props.samityId
        //   ? (params) => {
        //       const englishFormattedDate = moment(params?.value).format(
        //         "DD/MM/YYYY"
        //       );
        //       return englishFormattedDate;
        //     }
        //   : (params) => {
        //       const englishFormattedDate = moment(params?.value).format(
        //         "DD/MM/YYYY"
        //       );
        //       return englishFormattedDate;
        //     },
      },
      {
        headerName: 'সদস্যের ধরণ',
        field: 'samityMemberType',
        width: 130,
        type: 'singleSelect',
        editable: true,
        valueOptions: () => this.state.memberTypes,
        valueFormatter: (params) => {
          if (params.value) {
            const { label } = this.state.memberTypes.find((m) => m.value == params.value);
            return label;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], samityMemberType: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বৈঠকের ধরণ',
        field: 'meetingType',
        width: 130,
        type: 'singleSelect',
        editable: true,
        valueOptions: () => this.state.meetingTypes,
        valueFormatter: (params) => {
          if (params.value) {
            const { label } = this.state.meetingTypes.find((m) => m.value == params.value);
            return label;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], meetingType: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'সপ্তাহের অবস্থান',
        field: 'weekPosition',
        width: 130,
        type: 'singleSelect',
        editable: true,
        cellClassName: (params) => {
          if (!params.value && params.row.meetingType === 'M') return 'warning';

          return '';
        },
        valueOptions: () => this.state.weekPositions,
        valueFormatter: (params) => {
          if (params.value) {
            const { label } = this.state.weekPositions.find((m) => m.value == params.value);
            return label;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], weekPosition: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বৈঠকের দিন',
        field: 'meetingDay',
        width: 130,
        type: 'singleSelect',
        editable: true,
        valueOptions: () => {
          return this.state.meetingDays.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.meetingDays.find((f) => f.id == params.value);
            return data ? data.displayValue : params.value;
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], meetingDay: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'জেলা',
        field: 'districtId',
        width: 240,
        editable: true,
        type: 'singleSelct',
        cellClassName: (params) => {
          if (!params.value) return 'warning';

          return '';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);

          return (
            <Autocomplete
              fullWidth
              name="districtId"
              options={this.state.districts}
              getOptionLabel={(option) => option?.districtNameBangla}
              value={this.state.districts?.find((dis) => dis?.id == this.state?.data[index]?.districtId) || undefined}
              onChange={(e, value) => {
                if (value) {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    districtId: value?.id,
                  };

                  this.getUpazila(value?.id);
                  this.setState({ data: data });
                }
              }}
              renderInput={(params) => <TextField variant="filled" {...params} />}
            />
          );
        },

        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);

          return (
            <Autocomplete
              fullWidth
              name="districtId"
              options={this.state.districts}
              getOptionLabel={(option) => option?.districtNameBangla}
              value={this.state.districts?.find((dis) => dis?.id == this.state?.data[index]?.districtId) || undefined}
              onChange={(e, value) => {
                if (value) {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    districtId: value?.id,
                  };

                  this.getUpazila(value?.id);
                  this.setState({ data: data });
                }
              }}
              renderInput={(params) => <TextField variant="filled" {...params} />}
            />
          );
        },
      },

      {
        headerName: 'উপজেলা',
        field: 'upazilaId',
        width: 240,

        editable: true,
        cellClassName: (params) => {
          if (!params.value) return 'warning';

          return '';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);
          return (
            <Autocomplete
              fullWidth
              name="upazilaId"
              disableClearable={true}
              options={
                this.state.upazila[this.state.data[index]?.districtId]?.length > 0
                  ? this.state.upazila[this.state.data[index]?.districtId]
                  : []
              }
              getOptionLabel={(option) => option?.upaCityNameBangla}
              value={
                this.state.upazila[params?.row?.districtId]?.find(
                  (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId,
                ) || undefined
              }
              onChange={(event, value) => {
                const data = [...this.state.data];
                const foundIndex = data?.findIndex(
                  (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  upazilaId: value?.upaCityId,
                };
                this.getUnions(value?.upaCityId);
                this.setState({ data: data });
              }}
              renderInput={(params) => <TextField variant="filled" {...params} />}
            />
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);
          return (
            <Autocomplete
              fullWidth
              name="upazilaId"
              disableClearable={true}
              options={
                this.state.upazila[this.state.data[index]?.districtId]?.length > 0
                  ? this.state.upazila[this.state.data[index]?.districtId]
                  : []
              }
              getOptionLabel={(option) => option?.upaCityNameBangla}
              value={
                this.state.upazila[params?.row?.districtId]?.find(
                  (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId,
                ) || undefined
              }
              onChange={(event, value) => {
                const data = [...this.state.data];
                const foundIndex = data?.findIndex(
                  (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  upazilaId: value?.upaCityId,
                };
                this.getUnions(value?.upaCityId);
                this.setState({ data: data });
              }}
              renderInput={(params) => <TextField variant="filled" {...params} />}
            />
          );
        },
      },
      {
        headerName: 'ইউনিয়ন',
        field: 'union',
        width: 240,
        // type: "singleSelect",
        editable: true,
        cellClassName: (params) => {
          if (!params.value) return 'warning';
          return '';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);

          return (
            <Autocomplete
              fullWidth
              name="union"
              disableClearable={true}
              options={
                this.state.isRDAOrBARD
                  ? this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                    ? this.state.unions[this.state.data[index]?.upazilaId]
                    : []
                  : this.state.unions?.length > 0
                  ? this.state.unions
                  : []
                // this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                //   ?
                //   : []
              }
              getOptionLabel={(option) => option?.uniThanaPawNameBangla}
              value={
                //   this.state.unions?.find(
                //   (upa) => upa?.uniThanaPawId === this.state?.data[index]?.union
                // )

                this.state.unions[params?.row?.upazilaId]?.find(
                  (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId,
                ) || undefined
              }
              onChange={(e, value) => {
                const data = [...this.state.data];
                const foundIndex = data?.findIndex(
                  (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  union: value?.uniThanaPawId,
                };
                this.setState({ data: data });
              }}
              renderInput={(params) => <TextField variant="filled" {...params} />}
            />
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.samityOldCode === params.row.samityOldCode);

          return (
            <Autocomplete
              fullWidth
              name="union"
              variant="standard"
              disableClearable={true}
              options={
                this.state.isRDAOrBARD
                  ? this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                    ? this.state.unions[this.state.data[index]?.upazilaId]
                    : []
                  : this.state.unions?.length > 0
                  ? this.state.unions
                  : []
                // this.state.unions[this.state.data[index]?.upazilaId]?.length > 0
                //   ?
                //   : []
              }
              getOptionLabel={(option) => option?.uniThanaPawNameBangla}
              value={
                //   this.state.unions?.find(
                //   (upa) => upa?.uniThanaPawId === this.state?.data[index]?.union
                // )

                this.state.unions[params?.row?.upazilaId]?.find(
                  (upa) => upa?.upaCityId == this.state?.data[index]?.upazilaId,
                ) || undefined
              }
              onChange={(e, value) => {
                const data = [...this.state.data];
                const foundIndex = data?.findIndex(
                  (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  union: value?.uniThanaPawId,
                };
                this.setState({ data: data });
              }}
              renderInput={(params) => <TextField variant="filled" {...params} />}
            />
          );
        },
        // valueOptions: () => {
        //   return this.state.unions.map((f) => {
        //     return {
        //       label: f.uniThanaPawNameBangla,
        //       value: f.uniThanaPawId,
        //     };
        //   });
        // },
        // valueFormatter: (params) => {
        //   if (params.value) {
        //     const data = this.state?.unions?.find((f) => f.uniThanaPawId == params.value);
        //     return data?.uniThanaPawNameBangla || params.value;
        //   }
        // },
        // valueParser: (value, params) => {
        //   const data = [...this.state.data];
        //   const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
        //   data[foundIndex] = { ...data[foundIndex], union: value };
        //   this.setState({ data: data });
        //   return value;
        // },
      },
      {
        headerName: 'ঠিকানা',
        field: 'address',
        width: 140,
        type: 'string',
        editable: true,
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.samityOldCode === +params.row.samityOldCode);
          data[foundIndex] = { ...data[foundIndex], address: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'মাঠকর্মী',
        field: 'foUserId',
        width: 140,
        type: 'singleSelect',
        editable: true,
        cellClassName: (params) => {
          if (!params.value) return 'warning';
          return '';
        },
        valueOptions: () => {
          return this.state.fieldOfficers.map((f) => {
            return {
              label: f.nameBn,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const { nameBn } = this.state.fieldOfficers.find((f) => f.id == params.value);

            return nameBn;
          }
        },
        valueParser: (value, params) => {
          console.log('foValue', value);
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.samityOldCode?.toString() === params.row.samityOldCode?.toString(),
          );
          data[foundIndex] = { ...data[foundIndex], foUserId: value };
          this.setState({ data: data });
          return value;
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'বাতিল',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ row }) => {
          return [
            <Button
              key={row.samityOldCode}
              variant="outlined"
              color="error"
              onClick={() => this.handleDeleteClick(row.samityOldCode)}
              size="small"
            >
              <Close></Close>
            </Button>,
          ];
        },
      },
    ],
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
    kishoriHeaderMapping: {
      'School Name': 'schoolName',
      'School Code': 'schoolCode',
      'School Address': 'schoolAddress',
    },
    headerMapping: {
      'Samity Old Code': 'samityOldCode',
      'Samity Name': 'samityName',
      'Samity Formation Date': 'formationDate',
      'Member Type': 'samityMemberType',
      'Meeting Type': 'meetingType',
      'Week Position': 'weekPosition',
      'Meeting Day': 'meetingDay',
      Address: 'address',
    },
    meetingDayMapping: {
      saturday: 'শনিবার',
      sunday: 'রবিবার',
      monday: 'সোমবার',
      tuesday: 'মঙ্গলবার',
      wednesday: 'বুধবার',
      thursday: 'বৃহস্পতিবার',
      friday: 'শুক্রবার',
    },
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

  getConfig() {
    return localStorageData('config');
  }

  isRDAOrBARD = () => {
    const doptorId = tokenData()?.doptorId;
    const officeId = tokenData()?.officeId;
    const isRDAOrBARD = doptorId == 8 || doptorId == 4;

    const columns = isRDAOrBARD
      ? this.state.columns
      : reject(this.state.columns, (obj) => obj.field == 'districtId' || obj.field == 'upazilaId');

    this.setState({ officeId, isRDAOrBARD, columns });
  };

  getMemberType = (type) => {
    const samityMemberType = this.state.memberTypes.find((m) => m.label == type);
    return samityMemberType ? samityMemberType.value : '';
  };

  getMeetingType = (type) => {
    const meetingType = this.state.meetingTypes.find((m) => m.label == type);
    return meetingType ? meetingType.value : '';
  };

  getWeekPositions = (value) => {
    const position = this.state.weekPositions.find((m) => m.label == value);
    return position ? position.value : '';
  };

  getMeetingDay = (value) => {
    const dayNameBangla = this.state.meetingDayMapping[value] || value;
    const meetingDay = this.state.meetingDays.find((m) => m.displayValue == dayNameBangla);

    return meetingDay ? meetingDay.id : '';
  };

  async getSamityById() {
    const response = await axios.get(samityMigration + '/' + this.props.samityId, this.getConfig());
    if (response.status == 200) {
      const { data } = response.data.data;

      this.state.isRDAOrBARD && (await this.getUpazila(get(data, 'districtId')));

      this.setState({ data: [data] });
    }
    if (response.status == 404) {
      NotificationManager.error(response.errors[0], 5000);
    }
  }

  async getProjects() {
    const projectResponse = await axios.get(loanProject, this.getConfig());
    if (projectResponse.status == 200) {
      const projects = projectResponse.data.data;
      this.setState({ projects });
      this.autoSelectIfOneValue(projects, 'selectedProject');
      if (projects?.length === 1) {
        await this.getDistrictOffices();
      }
    } else {
      NotificationManager.error(projectResponse.errors[0].message, 5000);
    }
  }

  async getDistricts() {
    const response = await axios.get(allDistricts + `?allDistrict=true`, this.getConfig());
    if (response.status == 200) {
      const districts = response.data.data;
      this.setState({ districts });
    }
  }

  getUpazila = async (districtId) => {
    const response = await axios.get(upazilaByDistrictId + `?district=${districtId}&address=1`, this.getConfig());
    if (response.status == 200) {
      const upazila = response.data.data;
      this.setState((prevState) => ({
        upazila: { ...prevState.upazila, [districtId]: upazila },
      }));
    } else {
      NotificationManager.error(response.errors[0].message, 5000);
    }
  };

  getUnions = async (id = null) => {
    const upazilaId = id || this.state.selectedUpazilaOffice;

    if (upazilaId) {
      if (this.state.isRDAOrBARD) {
        const response = await axios.get(getUnionByUpazilaId + `&upazila=${upazilaId}&type=UPA`, this.getConfig());
        if (response.status == 200) {
          const unions = response.data.data;
          this.setState(() => ({
            unions: { [upazilaId]: [...unions] },
          }));
          // this.setState({ unions: [...this.state.unions, ...unions] });
        }
      } else {
        const upazilaOffice = this.state.upazilaOffices.find((u) => u.id == upazilaId);
        if (upazilaOffice) {
          const response = await axios.get(
            getUnionByUpazilaId + `&upazila=${upazilaOffice.upazilaId}&type=${upazilaOffice.upaCityType}`,
            this.getConfig(),
          );

          if (response.status == 200) {
            const unions = response.data.data;
            this.setState((prevState) => ({
              unions: [...prevState.unions, ...unions],
            }));
          } else {
            NotificationManager.error(response.errors[0].message, 5000);
          }
        } else {
          const response = await axios.get(getUnionByUpazilaId + `&upazila=${upazilaId}&type=UPA`, this.getConfig());
          if (response.status == 200) {
            const unions = response.data.data;

            this.setState((prevState) => ({
              unions: [...prevState.unions, ...unions],
            }));
            this.setState({ unions });
          } else {
            NotificationManager.error(response.errors[0].message, 5000);
          }
        }
      }
    }
  };

  async getMeetingDays() {
    const response = await axios.get(codeMaster + '?codeType=MET', this.getConfig());
    if (response.status == 200) {
      const meetingDays = response.data.data;
      this.setState({ meetingDays });
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

  async getDistrictOffices() {
    const districtResponse = await axios.get(districtOffice, this.getConfig());

    if (districtResponse.status == 200) {
      const districtOffices = districtResponse.data.data;
      this.setState({ districtOffices });
      this.autoSelectIfOneValue(districtOffices, 'selectedDistrictOffice');
    } else {
      NotificationManager.error(districtResponse.errors[0].message, 5000);
    }
  }

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

  async samityDuplicateCheck(samityCodes) {
    try {
      const response = await axios.post(samityMigration + '/duplicate-check', samityCodes, this.getConfig());

      if (response.status == 200) {
        return true;
      }
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 3000);
        });
      }
    }

    return false;
  }

  async postMigrationSamity() {
    const { data, selectedUpazilaOffice, selectedProject, upazilaOffices } = this.state;
    const payload = data.map((d) => {
      return {
        ...d,
        samityOldCode: d.samityOldCode.toString(),
        officeId: this.state.isRDAOrBARD ? this.state.officeId : selectedUpazilaOffice,
        projectId: selectedProject,
        formationDate: moment(d.formationDate).format('DD/MM/YYYY'),
        weekPosition: parseInt(d.weekPosition),
        upazilaId: this.state.isRDAOrBARD
          ? d.upazilaId
          : get(
              upazilaOffices.find((u) => u.id == selectedUpazilaOffice),
              'upazilaId',
            ),
      };
    });

    try {
      const res = await axios.post(samityMigration, payload, this.getConfig());

      if (res.status == 201) {
        NotificationManager.success('সমিতি আপলোড হয়েছে', '', 5000);
        this.setState({
          data: [],
          selectedProject: '',
          selectedUpazilaOffice: '',
          selectedDistrictOffice: '',
          districtOffices: [],
          upazilaOffices: [],
        });
        router.push('/migration');
      }
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 5000);
        });
      }
    }
  }

  async updateMigrationSamity() {
    const {
      data: [
        {
          address,
          foUserId,
          formationDate,
          meetingDay,
          meetingType,
          officeId,
          projectId,
          samityMemberType,
          samityName,
          samityOldCode,
          weekPosition,
          union,
          upazilaId,
        },
      ],
    } = this.state;

    try {
      const res = await axios.put(
        samityMigration + '/' + this.props.samityId,
        {
          address,
          foUserId,
          formationDate: moment(formationDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
          meetingDay,
          meetingType,
          officeId,
          projectId,
          samityMemberType,
          samityName,
          samityOldCode,
          weekPosition,
          union,
          upazilaId,
        },
        this.getConfig(),
      );
      if (res.status == 200) {
        NotificationManager.success('সমিতি আপডেট হয়েছে', '', 5000);
        this.setState({
          data: [],
        });
      }

      return true;
    } catch (error) {
      if (error.response.status == 400) {
        error.response.data.errors.map((r) => {
          NotificationManager.error(r.message, '', 5000);
        });
      }

      return false;
    }
  }

  async autoSelectIfOneValue(arr, key) {
    const value = arr[0]?.id || null;
    if (arr.length == 1) {
      if (key === 'selectedUpazilaOffice' && arr[0].upazilaId) {
        await this.getUnions(arr[0].upazilaId);
      }
      if (key === 'selectedDistrictOffice' && arr[0].id) {
        await this.getUpazilaOfficesByDistrict(arr[0].id);
      }

      this.setState({
        [key]: value,
      });
    }

    if (this.state.errors[key]) {
      const errors = { ...this.state.errors };

      delete errors[key];

      this.setState({ errors });
    }
  }

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

    return error ? error.details[0].message : null;
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.samityId !== this.props.samityId) {
      this.props.samityId && (await this.getSamityById());
      this.props.samityId && (await this.getUnions(get(this.state.data, '[0].upazilaId')));

      const columns = this.state.columns;
      const actionIndex = columns.findIndex((c) => c.field == 'actions');
      columns[actionIndex].hide = true;

      this.setState({ columns });
    }
  }

  async componentDidMount() {
    await this.getProjects();
    await this.getMeetingDays();
    await this.getFieldOfficers();
    this.isRDAOrBARD();
    await this.getDistricts();
    this.props.samityId && (await this.getSamityById());
    this.props.samityId && (await this.getUnions(get(this.state.data, '[0].upazilaId')));
  }

  processRowUpdate = (newState) => {
    if (!newState?.districtId || !newState?.upazilaId || !newState?.union) {
      return;
    }

    let data = [...this.state.data];
    const oldDataIndex = data.findIndex((d) => d.samityOldCode == newState.samityOldCode);
    data[oldDataIndex] = newState;
    this.setState({ data });
    return newState;
  };

  resetUnionData = () => {
    const data = this.state.data.map((d) => {
      return { ...d, union: '' };
    });

    this.setState({ data });
  };

  handleProcessRowUpdateError = () => {};

  handleCellEditStart = (params) => {
    this.state.editingRow.current = this.state.data.find((row) => row.id === params.id) || null;
  };

  handleCellEditStop = (params) => {
    if (this.state.isRDAOrBARD) {
      if (params.field == 'districtId') {
        this.processRowUpdate({ ...params.row, upazilaId: '', union: '' });
      }
      if (params.field == 'upazilaId') {
        this.processRowUpdate({ ...params.row, union: '' });
      }
    }
  };

  handleInputFIle = () => {};

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChangeFile = ({ target: { files } }) => {
    const file = files[0];

    this.setState({ file });
  };

  handleProjectChange = async (e) => {
    const selectedProject = removeSelectedValue(e.target.value);

    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.target);

    if (errorMessage) {
      errors[e.target.name] = errorMessage;
    } else delete errors[e.target.name];

    this.setState({ selectedProject, errors });
    selectedProject && (await this.getDistrictOffices());

    if (this.state.selectedProject === 13) {
      this.setState({
        headerMapping: {
          ...this.state.headerMapping,

          ...this.state.kishoriHeaderMapping,
        },
      });
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

    await this.getUnions(e.target.value);

    this.setState({
      selectedUpazilaOffice: removeSelectedValue(e.target.value),
      errors,
    });
  };

  handleUploadSamity = async () => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });

    if (errors) return;

    this.setState({ uploadButton: true });
    await this.postMigrationSamity();
    this.setState({ uploadButton: false });
  };

  handleClickUploadButton = () => {
    const errors = this.validate();

    this.setState({ errors: errors || {} });

    if (errors) return;

    this.setState({ open: true });
  };

  handleUpdateSamity = async () => {
    this.setState({ uploadButton: true });
    const result = await this.updateMigrationSamity();
    this.setState({ uploadButton: false });
    result && router.push('/migration');
  };
  areTwoArraySame = (array1, array2) => {
    if (array1.length === array2.length) {
      return array1.every((element, index) => {
        if (element === array2[index]) {
          return true;
        }
        return false;
      });
    }
    return false;
  };

  handleExcelToJson = async () => {
    const { headerMapping } = this.state;
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.load(this.state.file);

    const samityWorksheet = workbook.getWorksheet(1);

    let samityArray = [];

    samityWorksheet.eachRow(function (row) {
      const stringValues = row.values.map((v) => (isRichValue(v) ? richToString(v) : v));
      samityArray.push(stringValues);
    });

    const [[, ...samityKeys], ...rest] = samityArray;
    const updloadedXlKeysArray = samityKeys;
    const headerMappingArray = Object.keys(headerMapping);
    const isTwoArraySame = this.areTwoArraySame(updloadedXlKeysArray, headerMappingArray);
    if (!isTwoArraySame) {
      NotificationManager.error('সঠিক এক্সেল ফাইল আপলোড করুন');
      this.handleClose();
      return;
    }

    const samityObj = rest.map(([, ...s]) => {
      return s.reduce(function (p, c, i) {
        p[headerMapping[samityKeys[i]]] = c;
        return p;
      }, {});
    });
    const samityCodeCheck = samityObj.map((s) => {
      return { samityOldCode: s.samityOldCode.toString() };
    });

    const duplicateSamityCheck = await this.samityDuplicateCheck(samityCodeCheck);

    duplicateSamityCheck
      ? this.setState({
          data: samityObj.map((s) => {
            return {
              samityOldCode: s.samityOldCode || '',
              samityName: s.samityName || '',
              formationDate: s?.formationDate
                ? moment(s.formationDate, 'DD/MM/YYYY').format('DD MMMM YYYY').toString()
                : '',
              samityMemberType: this.getMemberType(s.samityMemberType?.toString()?.trim()),
              meetingType: this.getMeetingType(s.meetingType?.toString()?.trim()),
              weekPosition: this.getWeekPositions(s.weekPosition?.toString()?.trim()),
              meetingDay: this.getMeetingDay(s.meetingDay && s.meetingDay.toLowerCase()?.toString()?.trim()),
              address: s.address || '',
              foUserId: this.state.fieldOfficers?.length === 1 ? this.state?.fieldOfficers[0]?.id : '',
              union: '',
              districtId: '',
              ...(this.state.selectedProject == 13 && {
                schoolName: s.schoolName,
                schoolCode: s.schoolCode,
                schoolAddress: s.schoolAddress,
              }),
            };
          }),
          open: false,
        })
      : this.setState({ open: false, file: null });
  };

  handleDeleteClick = (id) => {
    const data = [...this.state.data];
    this.setState({
      data: data.filter((d) => d.samityOldCode != id),
    });
  };

  handleDownload = () => {
    const fileUrl = '/excel/Samity-migration-format.xlsx';

    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'samity-migration-sample.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  renderButton = () => {
    return this.props.samityId ? (
      <Button disabled={this.state.uploadButton} variant="outlined" onClick={this.handleUpdateSamity}>
        হালনাগাদ
      </Button>
    ) : (
      <>
        <Button sx={{ mr: '5px' }} variant="outlined" onClick={this.handleClickUploadButton}>
          এক্সেল আপলোড
        </Button>
        <Button
          ref={this.saveButtonRef}
          disabled={this.state.uploadButton}
          variant="outlined"
          onClick={this.handleUploadSamity}
        >
          সংরক্ষণ
        </Button>
      </>
    );
  };

  renderProjectSelectionDiv = () => {
    const {
      selectedDistrictOffice,
      selectedProject,
      selectedUpazilaOffice,
      errors,
      districtOffices,
      upazilaOffices,
      projects,
    } = this.state;

    return this.props.samityId ? (
      <></>
    ) : (
      <>
        <Divider sx={{ my: 2 }}></Divider>
        <Grid container sx={{ mb: 2 }} justifyContent="space-between" columnSpacing={{ sm: 2 }} rowSpacing={{ xs: 2 }}>
          <Grid item xs={12} sm={this.state.isRDAOrBARD ? 6 : 4}>
            <FormControl fullWidth>
              <InputLabel id="selectedProject">
                {selectedProject === '' ? star('প্রকল্পের নাম নির্বাচন করুন') : 'প্রকল্পের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedProject"
                id="selectedProject"
                value={selectedProject}
                label={selectedProject === '' ? 'প্রকল্পের নাম নির্বাচন করুন' : 'প্রকল্পের নাম'}
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
              <FormHelperText error={!!errors.selectedProject}>{errors.selectedProject}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} hidden={this.state.isRDAOrBARD}>
            <FormControl fullWidth>
              <InputLabel id="selectedDistrictOffice">
                {selectedDistrictOffice === '' ? star('জেলা কার্যালয়ের নাম নির্বাচন করুন') : 'জেলা কার্যালয়ের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedDistrictOffice"
                id="selectedDistrictOffice"
                value={selectedDistrictOffice}
                label={selectedDistrictOffice === '' ? 'জেলা কার্যালয়ের নাম নির্বাচন করুন' : 'জেলা কার্যালয়ের নাম'}
                onChange={this.handleDistrictOfficeChange}
                disabled={districtOffices.length == 1}
                size="small"
                error={!!errors.selectedDistrictOffice}
                helperText={errors.selectedDistrictOffice}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {districtOffices.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.officeNameBangla}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!errors.selectedDistrictOffice}>{errors.selectedDistrictOffice}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4} hidden={this.state.isRDAOrBARD}>
            <FormControl fullWidth>
              <InputLabel id="selectedUpazilaOffice">
                {selectedUpazilaOffice === '' ? star('উপজেলা কার্যালয়ের নাম নির্বাচন করুন') : 'উপজেলা কার্যালয়ের নাম'}
              </InputLabel>
              <Select
                required
                name="selectedUpazilaOffice"
                id="selectedUpazilaOffice"
                value={selectedUpazilaOffice}
                label={
                  selectedUpazilaOffice === '' ? star('উপজেলা কার্যালয়ের নাম নির্বাচন করুন') : 'উপজেলা কার্যালয়ের নাম'
                }
                onChange={this.handleUpazilaOfficeChange}
                disabled={upazilaOffices.length == 1}
                size="small"
                error={!!errors.selectedUpazilaOffice}
                helperText={errors.selectedUpazilaOffice}
                sx={{
                  '& .MuiSelect-select': {
                    textDecoration: 'none',
                  },
                }}
              >
                {upazilaOffices.map((option) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.officeNameBangla}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={!!errors.selectedUpazilaOffice}>{errors.selectedUpazilaOffice}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </>
    );
  };

  render() {
    return (
      <Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>{this.renderButton()}</Grid>
        {this.renderProjectSelectionDiv()}
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
                <Grid item>ফরম্যাট ডাউনলোড করুন</Grid>
                <Grid item>
                  <Button variant="outlined" size="small" onClick={this.handleDownload}>
                    ডাউনলোড
                  </Button>
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
          <Grid sx={{ width: '100%' }}>
            <DataGrid
              rows={this.state.data}
              columns={this.state.selectedProject == 13 ? this.state.kishoriColumn : this.state.columns}
              getRowId={(row) => row.samityOldCode}
              density={this.props.samityId ? 'standard' : 'compact'}
              disableColumnFilter={true}
              disableColumnMenu={true}
              disableColumnSelector={true}
              disableDensitySelector={true}
              disableExtendRowFullWidth={true}
              disableIgnoreModificationsIfProcessingProps={true}
              disableSelectionOnClick={true}
              disableVirtualization={true}
              hideFooter={this.props.samityId && true}
              experimentalFeatures={{ newEditingApi: true }}
              processRowUpdate={this.processRowUpdate}
              onProcessRowUpdateError={this.handleProcessRowUpdateError}
              onCellEditStart={this.handleCellEditStart}
              onCellEditStop={this.handleCellEditStop}
              columnVisibilityModel={{
                actions: !this.props.samityId,
              }}
              autoHeight={true}
              pageSize={this.state?.pageSize}
              rowsPerPageOptions={[8, 20, 50, 100]}
              onPageSizeChange={(newPageSize) => {
                this.setState({ pageSize: newPageSize });
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default UploadSamity;
