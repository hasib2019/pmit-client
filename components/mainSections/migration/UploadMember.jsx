import { Close, Delete, Edit } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Exceljs from 'exceljs';
import moment from 'moment';
import router from 'next/router';
import { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import { isRichValue, localStorageData, richToString } from 'service/common';
import { errorHandler } from 'service/errorHandler';
import { engToBang } from 'service/numberConverter';
import { codeMaster, product, samityMigration } from '../../../url/ApiList';
import { bangToEng } from '../adminstration/product-setup/savings-product/validator';

class UploadMember extends Component {
  state = {
    data: [],
    columns: [
      {
        headerName: '#',
        filterable: false,
        width: 50,
        renderCell: (index) => engToBang(index.api.getRowIndex(index.row.customerOldCode) + 1),
      },
      {
        headerName: 'সদস্যের কোড',
        field: 'customerOldCode',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params.row.customerOldCode),
        valueParser: (value) => {
          return bangToEng(value);
        },
        // valueFormatter: (params) => bangToEng(params?.value),
      },
      {
        headerName: 'নাম (ইংরেজি)',
        field: 'nameEn',
        width: 130,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            nameEn: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'নাম (বাংলা)',
        field: 'nameBn',
        width: 130,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            nameBn: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'জন্ম তারিখ',
        field: 'birthDate',
        width: 130,
        editable: true,
        type: 'date',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          let newDate;
          let formatedDateWithNewDate;
          if (this.props?.mode == 'list' || this.props?.mode == 'edit') {
            newDate = new Date(value);
            formatedDateWithNewDate = moment(newDate).format('DD/MM/YYYY');
          }
          data[foundIndex] = {
            ...data[foundIndex],
            birthDate: this.props?.mode == 'list' || this.props?.mode == 'edit' ? formatedDateWithNewDate : value,
          };
          this.setState({ data: data });
          return this.props?.mode == 'list' || this.props?.mode == 'edit' ? formatedDateWithNewDate : value;
        },
        valueFormatter: (params) => {
          const formatedDate =
            this.props?.mode == 'list' || this.props?.mode == 'edit'
              ? params?.value
              : moment(params?.value).format('DD/MM/YYYY');

          return engToBang(formatedDate);
        },
        // valueGetter: this.props.mode
        //   ? (params) =>
        //       engToBang(
        //         moment(params?.value, "DD/MM/YYYY")
        //           .toDate()
        //           .toLocaleDateString()
        //       )
        //   : (params) =>
        //       engToBang(moment(params?.value).toDate().toLocaleDateString()),
      },
      {
        headerName: 'পিতার নাম',
        field: 'fatherName',
        width: 130,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            fatherName: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'মাতার নাম',
        field: 'motherName',
        width: 130,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            motherName: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বৈবাহিক অবস্থা',
        field: 'maritalStatus',
        width: 140,
        editable: true,
        type: 'singleSelect',
        cellClassName: (params) => {
          if (!params.value && !params?.row?.maritalStatus) return 'warning';
        },
        valueOptions: () => {
          return this.state.maritalStatusList.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.maritalStatusList.find((f) => f.id == params.value);
            return data ? data.displayValue : '';
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode.toString() === params.row.customerOldCode?.toString(),
          );

          data[foundIndex] = {
            ...data[foundIndex],
            maritalStatus: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'স্বামী বা  স্ত্রীর নাম',
        field: 'spouseName',
        width: 140,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            spouseName: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'সদস্য নিবন্ধনের তারিখ',
        field: 'registrationDate',
        width: 140,
        editable: true,
        type: 'date',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex((obj) => +obj.customerOldCode === +params.row.customerOldCode);
          let newDate;
          let formatedDateWithNewDate;
          if (this.props?.mode == 'list' || this.props?.mode == 'edit') {
            newDate = new Date(value);
            formatedDateWithNewDate = moment(newDate).format('DD/MM/YYYY');
          }
          data[foundIndex] = {
            ...data[foundIndex],
            registrationDate:
              this.props?.mode == 'list' || this.props?.mode == 'edit' ? formatedDateWithNewDate : value,
          };
          this.setState({ data: data });
          return this.props?.mode == 'list' || this.props?.mode == 'edit' ? formatedDateWithNewDate : value;
        },
        valueFormatter: (params) => {
          const formatedDate =
            this.props?.mode == 'list' || this.props?.mode == 'edit'
              ? params?.value
              : moment(params?.value).format('DD/MM/YYYY');

          return engToBang(formatedDate);
        },
        // valueGetter: this.props.mode
        //   ? (params) =>
        //       engToBang(
        //         moment(params?.value, "DD/MM/YYYY")
        //           .toDate()
        //           .toLocaleDateString()
        //       )
        //   : (params) =>
        //       engToBang(moment(params?.value).toDate().toLocaleDateString()),
      },
      {
        headerName: 'মোবাইল নাম্বার',
        field: 'mobile',
        width: 120,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            mobile: bangToEng(value),
          };
          this.setState({ data: data });
          return bangToEng(value);
        },
      },
      {
        headerName: 'এন আইডি',
        field: 'nid',
        width: 120,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            nid: bangToEng(value),
          };
          this.setState({ data: data });
          return bangToEng(value);
        },
      },
      {
        headerName: 'জন্ম নিবন্ধন নাম্বার',
        field: 'brn',
        width: 130,
        editable: true,
        type: 'string',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            brn: bangToEng(value),
          };
          this.setState({ data: data });
          return bangToEng(value);
        },
      },
      {
        headerName: 'ধর্ম',
        field: 'religion',
        width: 120,
        editable: true,
        type: 'singleSelect',
        valueOptions: () => {
          return this.state.religions.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.religions.find((f) => f.id == params.value);
            return data ? data.displayValue : '';
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode.toString() === params.row.customerOldCode?.toString(),
          );

          data[foundIndex] = {
            ...data[foundIndex],
            religion: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'লিঙ্গ',
        field: 'gender',
        width: 80,
        editable: true,
        type: 'singleSelect',
        valueOptions: () => {
          return this.state.genders.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.genders.find((f) => f.id == params.value);
            return data ? data.displayValue : '';
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            gender: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'পেশা',
        field: 'occupation',
        width: 100,
        editable: true,
        type: 'singleSelect',
        valueOptions: () => {
          return this.state.occupations.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.occupations.find((f) => f.id == params.value);
            return data ? data.displayValue : '';
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            occupation: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'শিক্ষাগত যোগ্যতা',
        field: 'education',
        width: 130,
        editable: true,
        type: 'singleSelect',
        valueOptions: () => {
          return this.state.educations.map((f) => {
            return {
              label: f.displayValue,
              value: f.id,
            };
          });
        },
        valueFormatter: (params) => {
          if (params.value) {
            const data = this.state.educations.find((f) => f.id == params.value);
            return data ? data.displayValue : '';
          }
        },
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            education: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'বর্তমান ঠিকানা',
        field: 'presentAddress',
        width: 130,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            presentAddress: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'স্থায়ী ঠিকানা',
        field: 'permanentAddress',
        width: 140,
        editable: true,
        type: 'string',
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            permanentAddress: value,
          };
          this.setState({ data: data });
          return value;
        },
      },
      {
        headerName: 'ডিপোজিট প্রোডাক্ট',
        field: 'depositProduct',
        width: 150,
        editable: true,
        // type: 'singleSelect',
        cellClassName: (params) => {
          if (!params.value && params?.row?.currentDepositBalance) return 'warning';

          return '';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="depositProduct"
              value={this.state?.data[index]?.depositProduct}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  depositProduct: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.depositProducts?.map((dp) => {
                return (
                  <MenuItem key={dp?.id} value={dp?.id}>
                    {dp?.productName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="depositProduct"
              value={this.state?.data[index]?.depositProduct}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  depositProduct: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.depositProducts?.map((dp) => {
                return (
                  <MenuItem key={dp?.id} value={dp?.id}>
                    {dp?.productName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },

        // valueOptions: () => {
        //   return this.state.depositProducts.map((f) => {
        //     return {
        //       label: f.productName,
        //       value: f.id,
        //     };
        //   });
        // },
        // valueFormatter: (params) => {
        //   if (params.value) {
        //     const data = this.state.depositProducts.find((f) => f.id == params.value);
        //     return data ? data.productName : '';
        //   }
        // },
        // valueParser: (value, params) => {
        //   const data = [...this.state.data];
        //   const foundIndex = data?.findIndex(
        //     (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
        //   );
        //   data[foundIndex] = {
        //     ...data[foundIndex],
        //     depositProduct: value,
        //   };
        //   this.setState({ data: data });
        //   return value;
        // },
      },
      {
        headerName: 'বর্তমান ডিপোজিট ব্যালেন্স',
        field: 'currentDepositBalance',
        width: 130,
        editable: true,
        type: 'number',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            currentDepositBalance: bangToEng(value),
          };
          this.setState({ data: data });
          return bangToEng(value);
        },
      },
      {
        headerName: 'শেয়ার প্রোডাক্ট',
        field: 'shareProduct',
        width: 150,
        editable: true,
        // type: 'singleSelect',
        cellClassName: (params) => {
          if (!params.value && params?.row?.currentShareBalance) return 'warning';
        },
        renderCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="shareProduct"
              value={this.state?.data[index]?.shareProduct}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  shareProduct: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.shareProducts?.map((sp) => {
                return (
                  <MenuItem key={sp?.id} value={sp?.id}>
                    {sp?.productName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        renderEditCell: (params) => {
          const index = this.state.data.findIndex((row) => row.customerOldCode === params.row.customerOldCode);
          return (
            <Select
              fullWidth
              name="shareProduct"
              value={this.state?.data[index]?.shareProduct}
              variant="filled"
              onChange={(e) => {
                const data = [...this.state.data];
                const { value } = e.target;
                const foundIndex = data?.findIndex(
                  (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                );
                data[foundIndex] = {
                  ...data[foundIndex],
                  shareProduct: value,
                };
                this.setState({ data: data });
              }}
            >
              {this.state?.shareProducts?.map((sp) => {
                return (
                  <MenuItem key={sp?.id} value={sp?.id}>
                    {sp?.productName}
                  </MenuItem>
                );
              })}
            </Select>
          );
        },
        // valueOptions: () => {
        //   return this.state.shareProducts.map((f) => {
        //     return {
        //       label: f.productName,
        //       value: f.id,
        //     };
        //   });
        // },
        // valueFormatter: (params) => {
        //   if (params.value) {
        //     const data = this.state.shareProducts.find((f) => f.id == params.value);
        //     return data ? data.productName : '';
        //   }
        // },
        // valueParser: (value, params) => {
        //   const data = [...this.state.data];
        //   const foundIndex = data?.findIndex(
        //     (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
        //   );
        //   data[foundIndex] = {
        //     ...data[foundIndex],
        //     shareProduct: value,
        //   };
        //   this.setState({ data: data });
        //   return value;
        // },
      },
      {
        headerName: 'বর্তমান শেয়ার ব্যালেন্স',
        field: 'currentShareBalance',
        width: 130,
        editable: true,
        type: 'number',
        valueGetter: (params) => engToBang(params?.value),
        valueParser: (value, params) => {
          const data = [...this.state.data];
          const foundIndex = data?.findIndex(
            (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
          );
          data[foundIndex] = {
            ...data[foundIndex],
            currentShareBalance: bangToEng(value),
          };
          this.setState({ data: data });
          return bangToEng(value);
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'সম্পাদনা',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ row }) => this.renderActionButton(row),
      },
    ],

    headerMapping: {
      'Member Code *': 'customerOldCode',
      'English Name *': 'nameEn',
      'Bangla Name *': 'nameBn',
      'Date of Birth *': 'birthDate',
      "Father's Name *": 'fatherName',
      "Mother's Name": 'motherName',
      'Marital Status *': 'maritalStatus',
      'Spouse Name': 'spouseName',
      'Member Registration Date': 'registrationDate',
      'Mobile No *': 'mobile',
      'NID *': 'nid',
      'Birth Registration No': 'brn',
      'Religion *': 'religion',
      'Gender *': 'gender',
      'Occupation *': 'occupation',
      'Last Education *': 'lastEducation',
      'Present Address *': 'presentAddress',
      'Permanent Address *': 'permanentAddress',
      'Deposit Product *': 'depositProduct',
      'Current Deposit Balance': 'currentDepositBalance',
      'Share Product *': 'shareProduct',
      'Current Share Balance': 'currentShareBalance',
    },
    open: false,
    deleteDialogOpen: false,
    uploadButton: false,
    isKishoriProject: false,
    file: null,
    samity: null,
    religions: [],
    genders: [],
    deletedMemberCodes: [],
    editable: true,
    occupations: [],
    relationships: [],
    educations: [],
    depositProducts: [],
    shareProducts: [],
    pageSize: 8,
  };

  getConfig = () => {
    return localStorageData('config');
  };

  async getSamityById() {
    const response = await axios.get(samityMigration + '/' + this.props.samityId, this.getConfig());
    if (response.status == 200) {
      const samity = response.data.data;
      if (samity.data.projectId == 13) {
        this.setState({ isKishoriProject: true });

        await this.getGuardianRelationList();
        await this.getOccupationList();

        await this.getEducationList();
        const actionColumn = this.state.columns.pop();
        this.setState({
          columns: [
            ...this.state.columns.concat([
              {
                headerName: 'শ্রেণি',
                field: 'class',
                width: 150,
                editable: true,

                type: 'singleSelect',
                valueOptions: () => {
                  return this.state.educations.map((f) => {
                    return {
                      label: f.displayValue,
                      value: f.id,
                    };
                  });
                },
                valueFormatter: (params) => {
                  if (params.value) {
                    const data = this.state.educations.find((f) => f.id == params.value);
                    return data ? data.displayValue : '';
                  }
                },
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    class: value,
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'শাখা',
                field: 'sectionName',
                width: 150,
                editable: false,
                type: 'string',
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    sectionName: value,
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'রোল',
                field: 'rollNo',
                width: 150,
                editable: false,
                type: 'string',
                valueGetter: (params) => engToBang(params?.value),
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    rollNo: bangToEng(value),
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'পিতার জাতীয়  পরিচয়পত্র নম্বর',
                field: 'fathersNidNumber',
                width: 150,
                editable: false,
                type: 'string',
                valueGetter: (params) => engToBang(params?.value),
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    fathersNidNumber: bangToEng(value),
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'মাতার জাতীয় পরিচয়পত্র নম্বর',
                field: 'mothersNidNumber',
                width: 150,
                editable: false,
                type: 'string',
                valueGetter: (params) => engToBang(params?.value),
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    mothersNidNumber: bangToEng(value),
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'বৈধ অভিবাবকের নাম',
                field: 'legalGuardianName',
                width: 150,
                editable: true,
                type: 'string',
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    legalGuardianName: value,
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'বৈধ অভিবাবকের সাথে সম্পর্ক',
                field: 'relationshipWithLegalGuardian',
                width: 150,
                editable: true,

                type: 'singleSelect',
                valueOptions: () => {
                  return this.state.relationships.map((f) => {
                    return {
                      label: f.displayValue,
                      value: f.id,
                    };
                  });
                },
                valueFormatter: (params) => {
                  if (params.value) {
                    const data = this.state.relationships.find((f) => f.id == params.value);
                    return data ? data.displayValue : '';
                  }
                },
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    relationshipWithLegalGuardian: value,
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'বৈধ অভিবাবকের জাতীয় পরিচয়পত্র নম্বর',
                field: 'legalGuardianNid',
                width: 150,
                editable: true,
                type: 'string',
                valueGetter: (params) => engToBang(params?.value),
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    legalGuardianNid: bangToEng(value),
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              {
                headerName: 'বৈধ অভিবাবকের পেশা',
                field: 'legalGuardianOccupation',
                width: 150,
                editable: true,

                type: 'singleSelect',
                valueOptions: () => {
                  return this.state.occupations.map((f) => {
                    return {
                      label: f.displayValue,
                      value: f.id,
                    };
                  });
                },
                valueFormatter: (params) => {
                  if (params.value) {
                    const data = this.state.occupations.find((f) => f.id == params.value);
                    return data ? data.displayValue : '';
                  }
                },
                valueParser: (value, params) => {
                  const data = [...this.state.data];
                  const foundIndex = data?.findIndex(
                    (obj) => obj.customerOldCode?.toString() === params.row.customerOldCode?.toString(),
                  );
                  data[foundIndex] = {
                    ...data[foundIndex],
                    relationshipWithLegalGuardian: value,
                  };
                  this.setState({ data: data });
                  return value;
                },
              },
              actionColumn,
            ]),
          ],
        });
        this.setState({
          headerMapping: {
            ...this.state.headerMapping,
            Class: 'class',
            'Section Name': 'sectionName',
            'Roll No': 'rollNo',
            "Father's NID Number": 'fathersNidNumber',
            "Mother's NID Number": 'mothersNidNumber',
            'Legal Guardian Name': 'legalGuardianName',
            'Relationship with Legal Guardian': 'relationshipWithLegalGuardian',
            'Legal Guardian NID': 'legalGuardianNid',
            'Legal Guardian Occupation': 'legalGuardianOccupation',
          },
        });
      }
      let members = [];

      if (this.props.mode == 'edit') {
        members = samity?.data?.members.filter((m) => {
          return m.customerOldCode == this.props.customerOldCode;
        });
      }
      if (this.props.mode == 'list') {
        members = samity?.data?.members;
      }

      this.setState({ data: members, samity });
    }
    if (response.status == 404) {
      NotificationManager.error(response.errors[0], 5000);
    }
  }

  async getGenders() {
    const response = await axios.get(codeMaster + '?codeType=GEN', this.getConfig());

    if (response.status == 200) {
      const genders = response.data.data;
      this.setState({ genders });
    } else {
      NotificationManager.error(response.errors[0].message, 5000);
    }
  }

  async getReligions() {
    const response = await axios.get(codeMaster + '?codeType=REL', this.getConfig());

    if (response.status == 200) {
      const religions = response.data.data;
      this.setState({ religions });
    }
  }
  async getMaritalStatusList() {
    // ("config", config)
    try {
      let marriageInfo = await axios.get(codeMaster + '?codeType=MST', this.getConfig());
      let marriageList = marriageInfo.data.data;
      // ("Marriage Info", marriageList);
      this.setState({ maritalStatusList: marriageList });
    } catch (err) {
      // (err);
    }
  }

  async getOccupationList() {
    const response = await axios.get(codeMaster + '?codeType=OCC', this.getConfig());

    if (response.status == 200) {
      const occupations = response.data.data;
      this.setState({ occupations });
    }
  }

  async getGuardianRelationList() {
    try {
      let guardianRelationInfo = await axios.get(codeMaster + '?codeType=RLN', this.getConfig());
      let guardianRelationInfoData = guardianRelationInfo.data.data;
      this.setState({ relationships: guardianRelationInfoData });
    } catch (err) {
      // (err);
    }
  }

  async getEducationList() {
    const response = await axios.get(codeMaster + '?codeType=EDT', this.getConfig());

    if (response.status == 200) {
      const educations = response.data.data;
      this.setState({ educations });
    }
  }
  async getMarriageList() {
    // ("config", config)
    try {
      let marriageInfo = await axios.get(codeMaster + '?codeType=MST', this.getConfig());
      let marriageList = marriageInfo.data.data;
      // ("Marriage Info", marriageList);
      this.setState({ maritalStatusList: marriageList });
    } catch (err) {
      errorHandler(err);
      // (err);
    }
  }

  async getDepositProducts() {
    const response = await axios.get(product, {
      params: {
        depositNature: 'R',
        productType: 'L',
        projectId: this.state.samity?.projectId,
      },
      ...this.getConfig(),
    });

    if (response.status == 200) {
      const depositProducts = response.data.data;
      this.setState({ depositProducts });
    }
  }

  async getShareProducts() {
    const response = await axios.get(product, {
      params: {
        depositNature: 'S',
        productType: 'L',
        projectId: this.state.samity?.projectId,
      },
      ...this.getConfig(),
    });

    if (response.status == 200) {
      const shareProducts = response.data.data;
      this.setState({ shareProducts });
    }
  }

  async memberDuplicateCheck(samityId, Members) {
    try {
      const response = await axios.post(
        samityMigration + `/${samityId}/member-duplicate-check`,
        Members,
        this.getConfig(),
      );

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

  async postMigrationSamityMembers() {
    const { data } = this.state;

    const payload = data.map((d) => {
      console.log('ddddddddddddddddddddddd', d);
      // return;
      return {
        ...d,
        nid: bangToEng(d.nid),
        brn: bangToEng(d.brn),
        currentDepositBalance: bangToEng(d.currentDepositBalance),
        customerOldCode: bangToEng(d.customerOldCode),
        mobile: bangToEng(d.mobile),
        birthDate: moment(d.birthDate).format('DD/MM/YYYY'),
        registrationDate: moment(d.registrationDate).format('DD/MM/YYYY'),
      };
    });
    // console.log('memberPayload', payload);
    // return;
    try {
      const res = await axios.post(samityMigration + '/' + this.props.samityId + '/members', payload, this.getConfig());
      if (res.status == 201) {
        NotificationManager.success('সমিতির সদস্য আপলোড হয়েছে');
        this.setState({
          data: [],
        });

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

  async updateMigrationSamityMembers() {
    const { data } = this.state;

    const payload = data.map((d) => {
      return {
        ...d,
        birthDate: moment(d.birthDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        registrationDate: moment(d.registrationDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
      };
    });

    try {
      const res = await axios.put(samityMigration + '/' + this.props.samityId + '/members', payload, this.getConfig());
      if (res.status == 200) {
        NotificationManager.success('সমিতির সদস্য আপডেট হয়েছে');
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

  async deleteSamityMembers() {
    const { deletedMemberCodes } = this.state;
    const res = await axios.delete(samityMigration + '/' + this.props.samityId + '/members', {
      data: deletedMemberCodes,
      ...this.getConfig(),
    });
    if (res.status == 200) {
      NotificationManager.success('সমিতির সদস্য ডিলিট হয়েছে');
      this.setState({
        deletedMemberCodes: [],
        deleteDialogOpen: false,
      });

      await this.getSamityById();
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.samityId !== this.props.samityId || prevProps.mode !== this.props.mode) {
      this.props.samityId && (await this.getSamityById());
    }

    if (prevProps.customerOldCode !== this.props.customerOldCode) {
      this.props.samityId && this.props.customerOldCode && this.setByCustomerCode();
    }
  }

  async componentDidMount() {
    await this.getMaritalStatusList();
    await this.getReligions();
    await this.getGenders();
    await this.getOccupationList();
    await this.getEducationList();
    this.props.samityId && (await this.getSamityById());
    await this.getDepositProducts();
    await this.getShareProducts();
  }

  getOccupationId(name) {
    const data = this.state.occupations.find((r) => r.displayValue == name);
    return data ? data.id : null;
  }
  getRelationshipId(name) {
    const data = this.state.relationships.find((r) => r.displayValue == name);
    return data ? data.id : null;
  }
  getReligionId(name) {
    const data = this.state.religions.find((r) => r.displayValue == name?.toString().trim());
    return data ? data.id : null;
  }
  getMaritalStatusId(name) {
    const data = this.state.maritalStatusList.find((r) => r.displayValue == name?.toString().trim());
    return data ? data.id : null;
  }

  getGenderId(name) {
    'memberParams', name;
    const data = this.state.genders.find((r) => r.displayValue == name?.toString().trim());

    return data ? data.id : null;
  }
  getClassId(name) {
    const data = this.state.educations.find((r) => r.displayValue == name?.toString().trim());

    return data ? data.id : null;
  }

  setByCustomerCode() {
    const samity = this.state.samity;
    const members = samity.data.members.filter((m) => {
      return m.customerOldCode == this.props.customerOldCode;
    });

    this.setState({
      data: members,
    });
  }

  processRowUpdate = (newState) => {
    let data = [...this.state.data];
    const oldDataIndex = data.findIndex((d) => d.customerOldCode == newState.customerOldCode);
    data[oldDataIndex] = newState;
    this.setState({ data });
    return newState;
  };

  handleProcessRowUpdateError = (error) => {
    error;
  };

  handleInputFIle = () => {};

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDeleteDialogClose = () => {
    this.setState({ deleteDialogOpen: false });
  };

  handleChangeFile = ({ target: { files } }) => {
    const file = files[0];

    this.setState({ file });
  };

  handleMemberDelete = async () => {
    await this.deleteSamityMembers();
  };

  handleUploadMember = async () => {
    this.setState({ uploadButton: true });
    const result = await this.postMigrationSamityMembers();
    this.setState({ uploadButton: false });

    result && router.push(`/migration/members/list/${this.props.samityId}`);
  };

  handleUpdateMember = async () => {
    this.setState({ uploadButton: true });
    const result = await this.updateMigrationSamityMembers();
    this.setState({ uploadButton: false });

    result && router.push(`/migration/members/list/${this.props.samityId}`);
  };
  areTwoArraySame2 = (array1, array2) => {
    if (array1?.length === 0 || array2?.length === 0) {
      return false;
    }
    if (array1.length !== array2?.length) {
      return false;
    }
    let obj1 = {};
    let obj2 = {};
    for (let i = 0; i < array1?.length; i++) {
      obj1[array1[i]] = (obj1[i] || 0) + 1;
    }
    for (let i = 0; i < array2?.length; i++) {
      obj2[array1[i]] = (obj2[i] || 0) + 1;
    }
    for (let key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  };
  areTwoArraySame = (array1, array2) => {
    console.log('array1andarray2', array1, array2);
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

  setDepositProductIfDepositProuctsHasOneValue = (object) => {
    console.log('objcetttt', object);
    if (object?.currentDepositBalance) {
      if (this.state.depositProducts?.length === 1) {
        return this.state.depositProducts[0]?.id;
      }
    } else {
      return null;
    }
  };
  setShareProductIfShareProuctsHasOneValue = (object) => {
    console.log('objcetttt', object);
    if (object?.currentShareBalance) {
      if (this.state.shareProducts?.length === 1) {
        return this.state.shareProducts[0]?.id;
      }
    } else {
      return null;
    }
  };

  handleExcelToJson = async () => {
    const { headerMapping } = this.state;
    const workbook = new Exceljs.Workbook();
    await workbook.xlsx.load(this.state.file);

    const memberWorksheet = workbook.getWorksheet(1);

    let memberArray = [];

    memberWorksheet.eachRow(function (row) {
      const stringValues = row.values.map((v) => (isRichValue(v) ? richToString(v) : v));
      memberArray.push(stringValues);
    });

    const [[, ...memberKeys], ...rest] = memberArray;
    const updloadedXlKeysArray = memberKeys;
    const headerMappingArray = Object.keys(headerMapping);
    const foundShareProductIndex = headerMappingArray.findIndex((elm) => elm === 'Share Product *');
    const foundDepositProductIndex = headerMappingArray.findIndex((elm) => elm === 'Deposit Product *');
    headerMappingArray.splice(foundShareProductIndex, 1);
    headerMappingArray.splice(foundDepositProductIndex, 1);
    const isTwoArraySame = this.areTwoArraySame2(updloadedXlKeysArray, headerMappingArray);
    if (!isTwoArraySame && !this.state.isKishoriProject) {
      NotificationManager.error('সঠিক এক্সেল ফাইল আপলোড করুন');
      this.handleClose();
      return;
    }
    const memberObj = rest.map(([, ...s]) => {
      return s.reduce(function (p, c, i) {
        p[headerMapping[memberKeys[i]]] = c;
        return p;
      }, {});
    });

    const memberDuplicateCheckObj = memberObj.map(({ customerOldCode, nid, brn }) => {
      return this.state.isKishoriProject
        ? { customerOldCode: customerOldCode?.toString(), brn }
        : { customerOldCode: customerOldCode?.toString(), nid, brn };
    });

    const duplicateCheck = await this.memberDuplicateCheck(this.props.samityId, memberDuplicateCheckObj);

    duplicateCheck
      ? this.setState({
          data: memberObj.map((m) => {
            return {
              ...m,
              customerOldCode: m.customerOldCode.toString(),
              birthDate: m?.birthDate ? moment(m.birthDate, 'DD/MM/YYYY').format('DD MMMM YYYY').toString() : '',
              registrationDate: m?.registrationDate
                ? moment(m.registrationDate, 'DD/MM/YYYY').format('DD MMMM YYYY').toString()
                : '',
              religion: this.getReligionId(m.religion),
              gender: this.getGenderId(m.gender),
              occupation: this.getOccupationId(m.occupation),
              education: this.getClassId(m.lastEducation),
              presentAddress: m.presentAddress,
              permanentAddress: m.permanentAddress,
              nid: m.nid ? m.nid.toString() : '',
              brn: m.brn ? m.brn.toString() : '',
              shareProduct: this.setShareProductIfShareProuctsHasOneValue(m),
              depositProduct: this.setDepositProductIfDepositProuctsHasOneValue(m),
              maritalStatus: this.getMaritalStatusId(m.maritalStatus),
              spouseName: m.spouseName ? m.spouseName : '',
              ...(this.state.isKishoriProject && {
                class: this.getClassId(m.class),
                sectionName: m.sectionName,
                rollNo: m.rollNo,
                fathersNidNumber: m.fathersNidNumber,
                mothersNidNumber: m.mothersNidNumber,
                legalGuardianName: m.legalGuardianName,
                relationshipWithLegalGuardian: this.getRelationshipId(m.relationshipWithLegalGuardian),
                legalGuardianNid: m.legalGuardianNid,
                legalGuardianOccupation: this.getOccupationId(m.legalGuardianOccupation),
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
      data: data.filter((d) => d.customerOldCode != id),
    });
  };

  handleMemberDeleteClick = (code) => {
    const deletedMemberCodes = this.state.deletedMemberCodes;
    deletedMemberCodes.push(code);

    this.setState({
      deleteDialogOpen: true,
      deletedMemberCodes,
    });
  };

  handleDownload = () => {
    const fileUrl = '/excel/Member-migration-format.xlsx';

    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'member-migration-sample.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  renderButtons() {
    if (this.props.mode == 'list') {
      return null;
    } else if (this.props.mode == 'edit') {
      return (
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button disabled={this.state.uploadButton} variant="outlined" onClick={this.handleUpdateMember}>
            হালনাগাদ
          </Button>
        </Grid>
      );
    } else {
      return (
        <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button sx={{ mr: '5px' }} variant="outlined" onClick={this.handleClickOpen}>
            এক্সেল আপলোড
          </Button>
          <Button disabled={this.state.uploadButton} variant="outlined" onClick={this.handleUploadMember}>
            সংরক্ষণ
          </Button>
        </Grid>
      );
    }
  }

  renderActionButton = ({ customerOldCode }) => {
    return this.props.mode == 'list'
      ? [
          <Grid container mx={2} key={customerOldCode}>
            <Tooltip placement="top-start" title="সদস্য হালনাগাদ">
              <Edit
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  router.push(`/migration/members/edit/${this.props.samityId}?customerOldCode=${customerOldCode}`)
                }
                color="action"
              ></Edit>
            </Tooltip>
            <Tooltip placement="top-start" title="সদস্য বাতিল">
              <Delete
                style={{ cursor: 'pointer' }}
                onClick={() => this.handleMemberDeleteClick(customerOldCode)}
                color="error"
              ></Delete>
            </Tooltip>
          </Grid>,
        ]
      : [
          <Tooltip placement="top-start" title="সদস্য বাতিল" key={customerOldCode}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => this.handleDeleteClick(customerOldCode)}
              size="small"
            >
              <Close></Close>
            </Button>
          </Tooltip>,
        ];
  };

  renderUploadDialog = () => {
    return (
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
    );
  };

  renderDeleteConfirmation = () => {
    return (
      <Dialog
        open={this.state.deleteDialogOpen}
        onClose={this.handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ mb: 0, pb: 0 }}
      >
        <DialogTitle id="alert-dialog-title">{'ডিলিট করুন'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">আপনি নিশ্চিত এই সদস্য ডিলিট করতে চান?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleDeleteDialogClose} variant="outlined">
            বাতিল করুন
          </Button>
          <Button variant="outlined" onClick={this.handleMemberDelete}>
            সদস্য বাতিল করুন
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  render() {
    return (
      <Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Grid>
            <Grid mb={1}>সমিতির নামঃ {this.state.samity?.data?.samityName}</Grid>
            <Grid>সমিতি কোডঃ {engToBang(this.state.samity?.data?.samityOldCode)}</Grid>
          </Grid>
          {this.renderButtons()}
        </Grid>

        <Grid>
          {this.renderUploadDialog()}
          {this.renderDeleteConfirmation()}

          <Grid
            sx={{
              width: '100%',
            }}
          >
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
              experimentalFeatures={{
                newEditingApi: true,
              }}
              hideFooter={this.props.mode == 'edit'}
              processRowUpdate={this.processRowUpdate}
              onProcessRowUpdateError={this.handleProcessRowUpdateError}
              isCellEditable={() => this.props.mode != 'list'}
              columnVisibilityModel={{
                actions: this.props.mode != 'edit',
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

export default UploadMember;
